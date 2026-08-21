const axios = require('axios');
const Device = require('./device');
const { updateDevicePhysics } = require('./physics');
const { applyFault, setFault, clearFault, FAULT_TYPES } = require('./faults');
const config = require('./config');

class Simulator {
  constructor(deviceCount = config.DEVICE_COUNT) {
    this.devices = new Map();
    this.timers = new Map();
    this.running = false;

    for (let i = 1; i <= deviceCount; i++) {
      const deviceId = `SL-${String(i).padStart(3, '0')}`;
      this.devices.set(deviceId, new Device(deviceId));
    }
  }

  async tickDevice(device) {
    const now = config.getSimulatedTime();
    updateDevicePhysics(device, now);
    applyFault(device);

    if (!device.isCommunicating) {
      console.log(`[${device.deviceId}] (silent — not communicating)`);
      return;
    }

    const telemetry = device.toTelemetry(now);

    if (!config.ENABLE_BACKEND_POST) {
      // Local test mode: backend endpoint isn't ready yet, so we just log.
      console.log(telemetry);
      return;
    }

    try {
      const response = await axios.post(config.BACKEND_URL, telemetry, {
        timeout: 3000,
      });
      console.log(`[${device.deviceId}] sent -> ${response.status}`);
    } catch (err) {
      const reason = err.response
        ? `HTTP ${err.response.status}`
        : err.code || err.message;
      console.log(`[${device.deviceId}] send FAILED (${reason})`);
    }
  }

  start() {
    if (this.running) return;
    this.running = true;

    let index = 0;
    for (const device of this.devices.values()) {
      const staggerMs = (index * config.TICK_INTERVAL_MS) / this.devices.size;
      index++;

      const timeoutId = setTimeout(() => {
        this.tickDevice(device).catch((e) => console.error(e));
        const intervalId = setInterval(
          () => this.tickDevice(device).catch((e) => console.error(e)),
          config.TICK_INTERVAL_MS
        );
        this.timers.set(device.deviceId, intervalId);
      }, staggerMs);

      this.timers.set(device.deviceId, timeoutId);
    }

    console.log(`Simulator started with ${this.devices.size} devices.`);
  }

  stop() {
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
      clearInterval(timer);
    }
    this.timers.clear();
    this.running = false;
    console.log('Simulator stopped.');
  }

  getDevice(deviceId) {
    return this.devices.get(deviceId);
  }

  injectFault(deviceId, faultType) {
    const device = this.getDevice(deviceId);
    if (!device) throw new Error(`Unknown device: ${deviceId}`);
    setFault(device, faultType);
    console.log(`Injected ${faultType} into ${deviceId}`);
  }

  clearFault(deviceId) {
    const device = this.getDevice(deviceId);
    if (!device) throw new Error(`Unknown device: ${deviceId}`);
    clearFault(device);
    console.log(`Cleared fault on ${deviceId}`);
  }
}

module.exports = Simulator;
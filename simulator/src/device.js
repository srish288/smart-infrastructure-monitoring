class Device {
  constructor(deviceId) {
    this.deviceId = deviceId;
    this.source = 'SIMULATOR';

    // Fixed per-device characteristics, set once at creation.
    // This is what gives each virtual streetlight its own "personality"
    // so a fleet of 10 devices doesn't behave like 10 identical clones.
    this.characteristics = {
      baseVoltage: 230 + (Math.random() * 6 - 3),              // ~227V–233V nominal
      baseCurrentWhenOn: 0.3 + (Math.random() * 0.08 - 0.04),  // ~0.26A–0.34A
      baseTemperature: 28 + (Math.random() * 6 - 3),           // ambient baseline °C
    };

    // Live telemetry values. Updated every tick by physics.js and faults.js.
    // Initialized to a safe OFF/idle state.
    this.voltage = this.characteristics.baseVoltage;
    this.current = 0;
    this.power = 0;
    this.illumination = 0;
    this.temperature = this.characteristics.baseTemperature;
    this.lampState = 'OFF';
    this.sensorStatus = 'OK';

    // Simulation-internal state — NOT part of the telemetry contract.
    // faults.js reads/writes these; the backend never sees them directly.
    this.activeFault = 'NORMAL';
    this.isCommunicating = true; // COMMUNICATION_LOSS sets this to false
        this.lastPhysicsUpdate = null; // tracks simulated time, used by physics.js to scale step sizes
  }

  // Produces the exact telemetry contract shape. Caller supplies the
  // timestamp (simulated time from config.js) so this class doesn't
  // need to know anything about the simulation clock.
  toTelemetry(timestamp) {
    return {
      deviceId: this.deviceId,
      timestamp: (timestamp || new Date()).toISOString(),
      source: this.source,
      voltage: Number(this.voltage.toFixed(2)),
      current: Number(this.current.toFixed(2)),
      power: Number(this.power.toFixed(2)),
      illumination: Math.round(this.illumination),
      lampState: this.lampState,
      temperature: Number(this.temperature.toFixed(2)),
      sensorStatus: this.sensorStatus,
    };
  }
}

module.exports = Device;
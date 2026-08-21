const config = require('./config');

// Step sizes in updateDevicePhysics were tuned assuming ~5 simulated minutes
// pass between ticks (default: TICK_INTERVAL_MS=5000ms * TIME_SCALE=60).
// If TIME_SCALE is overridden (e.g. fast-forwarding day/night for testing),
// far more simulated time can elapse per real tick. We scale step sizes
// proportionally so transitions stay physically consistent regardless of
// how fast the simulated clock is moving.
const REFERENCE_SIM_MS_PER_TICK = 5000 * 60; // 5 simulated minutes

function smoothStep(current, target, maxStep, noise, scale = 1) {
  const scaledMaxStep = maxStep * scale;
  const scaledNoise = noise * Math.min(scale, 1); // don't amplify jitter at high scale
  const diff = target - current;
  const step = Math.max(-scaledMaxStep, Math.min(scaledMaxStep, diff));
  const jitter = target === 0 ? 0 : (Math.random() * 2 - 1) * scaledNoise;
  let next = current + step + jitter;
  if (Math.abs(next) < 0.001) next = 0;
  return next;
}

function isNightAt(simulatedTime) {
  const utcHours = simulatedTime.getUTCHours() + simulatedTime.getUTCMinutes() / 60;
  const localHours = (utcHours + config.TIMEZONE_OFFSET_HOURS + 24) % 24;
  return localHours >= config.NIGHT_START_HOUR || localHours < config.DAY_START_HOUR;
}

function updateDevicePhysics(device, simulatedTime) {
  let deltaSimMs = REFERENCE_SIM_MS_PER_TICK;
  if (device.lastPhysicsUpdate) {
    const elapsed = simulatedTime.getTime() - device.lastPhysicsUpdate.getTime();
    if (elapsed > 0) deltaSimMs = elapsed;
  }
  device.lastPhysicsUpdate = simulatedTime;
  const scale = deltaSimMs / REFERENCE_SIM_MS_PER_TICK;

  const night = isNightAt(simulatedTime);
  const { baseVoltage, baseCurrentWhenOn, baseTemperature } = device.characteristics;

  device.lampState = night ? 'ON' : 'OFF';

  device.voltage = smoothStep(device.voltage, baseVoltage, 0.3, 0.2, scale);

  const targetCurrent = device.lampState === 'ON' ? baseCurrentWhenOn : 0;
  device.current = Math.max(0, smoothStep(device.current, targetCurrent, 0.02, 0.005, scale));

  device.power = device.voltage * device.current;

  const targetIllumination = device.lampState === 'ON' ? 800 : 0;
  device.illumination = Math.max(0, smoothStep(device.illumination, targetIllumination, 40, 5, scale));

  const targetTemperature = baseTemperature + (device.lampState === 'ON' ? 4 : 0);
  device.temperature = smoothStep(device.temperature, targetTemperature, 0.15, 0.05, scale);

  device.sensorStatus = 'OK';
}

module.exports = {
  updateDevicePhysics,
  isNightAt,
};
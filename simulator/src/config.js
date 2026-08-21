require('dotenv').config();

const config = {
  BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:4000/api/readings',
    ENABLE_BACKEND_POST: process.env.ENABLE_BACKEND_POST === 'true', // false until backend's /api/readings is ready
  DEVICE_COUNT: parseInt(process.env.DEVICE_COUNT, 10) || 10,
  TICK_INTERVAL_MS: parseInt(process.env.TICK_INTERVAL_MS, 10) || 5000,
  TIME_SCALE: parseInt(process.env.TIME_SCALE, 10) || 60,
  DAY_START_HOUR: 6,
  NIGHT_START_HOUR: 18,
  TIMEZONE_OFFSET_HOURS: parseFloat(process.env.TIMEZONE_OFFSET_HOURS) || 5.5, // IST, used for day/night — independent of host machine's OS timezone
};

// Real wall-clock moment the simulator process started.
const simulationStartTime = Date.now();

// Returns the current simulated Date, derived from real elapsed time * TIME_SCALE.
// We derive it fresh each call instead of storing/incrementing a variable,
// so it never drifts and stays consistent no matter who calls it or when.
function getSimulatedTime() {
  const realElapsedMs = Date.now() - simulationStartTime;
  const simulatedElapsedMs = realElapsedMs * config.TIME_SCALE;
  return new Date(simulationStartTime + simulatedElapsedMs);
}

module.exports = {
  ...config,
  getSimulatedTime,
};
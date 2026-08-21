const FAULT_TYPES = [
  'NORMAL',
  'LAMP_FAILURE',
  'OVERVOLTAGE',
  'UNDERVOLTAGE',
  'OVERCURRENT',
  'OVERTEMPERATURE',
  'SENSOR_FAILURE',
  'COMMUNICATION_LOSS',
  'INTERMITTENT_FAULT',
];

function setFault(device, faultType) {
  if (!FAULT_TYPES.includes(faultType)) {
    throw new Error(`Unknown fault type: ${faultType}`);
  }
  device.activeFault = faultType;
  if (faultType !== 'COMMUNICATION_LOSS' && faultType !== 'INTERMITTENT_FAULT') {
    device.isCommunicating = true;
  }
}

function clearFault(device) {
  device.activeFault = 'NORMAL';
  device.isCommunicating = true;
}

// Distorts a device's already-computed "healthy" telemetry to match the
// active fault's symptoms. Must be called AFTER updateDevicePhysics()
// every tick.
function applyFault(device) {
  switch (device.activeFault) {
    case 'NORMAL':
      break;

    case 'LAMP_FAILURE':
      device.lampState = 'OFF';
      device.current = 0;
      device.power = 0;
      device.illumination = 0;
      break;

       case 'OVERVOLTAGE': {
      const target = device.characteristics.baseVoltage + 45;
      device.voltage = target + (Math.random() * 6 - 3);
      device.power = device.voltage * device.current;
      break;
    }

    case 'UNDERVOLTAGE': {
      const target = Math.max(0, device.characteristics.baseVoltage - 45);
      device.voltage = target + (Math.random() * 6 - 3);
      device.power = device.voltage * device.current;
      break;
    }

    case 'OVERCURRENT': {
      const target = device.characteristics.baseCurrentWhenOn + 0.6;
      device.current = target + (Math.random() * 0.06 - 0.03);
      device.power = device.voltage * device.current;
      break;
    }

    case 'OVERTEMPERATURE':
      // Adds a bit on top of physics's own value each tick, so it climbs
      // gradually rather than jumping, capped at a realistic ceiling.
      device.temperature = Math.min(device.temperature + 0.8, 95);
      break;

    case 'SENSOR_FAILURE':
      device.sensorStatus = 'ERROR';
      break;

    case 'COMMUNICATION_LOSS':
      device.isCommunicating = false;
      break;

    case 'INTERMITTENT_FAULT':
      // Flaky link: randomly drops and restores communication tick to tick.
      device.isCommunicating = Math.random() >= 0.4;
      break;

    default:
      break;
  }
}

module.exports = {
  FAULT_TYPES,
  setFault,
  clearFault,
  applyFault,
};
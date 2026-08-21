const Simulator = require('./src/simulator');

const sim = new Simulator(50);
sim.start();

setTimeout(() => {
  sim.stop();
  console.log('--- 50-device test complete ---');
  process.exit(0);
}, 30000);
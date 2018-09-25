
const { spawn } = require('child_process');
const server = require('./server');


if (require.main === module) {
  init();
}


function runVue() {
  const command = 'node_modules/.bin/vue-cli-service';
  const args = ['serve'];
  spawn(command, args, { stdio: 'inherit' });
}


function init() {
  server.init()
  .then(function () {
    runVue();
  })
  .catch(console.error);
}


module.exports = { init };


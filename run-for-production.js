
const { spawn } = require('child_process');
const server = require('./server');


if (require.main === module) {
  init();
}


function compileVue() {
  const command = 'node_modules/.bin/vue-cli-service';
  const args = ['build'];
  spawn(command, args, { stdio: 'inherit' });
}


function init() {
  server.init()
  .then(function () {
    compileVue();
  })
  .catch(console.error);
}


module.exports = { init };


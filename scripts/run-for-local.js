const { spawn } = require('child_process');
const server = require('../index');

if (require.main === module) {
  init();
}

function runVue() {
  const command = 'node_modules/.bin/vite';
  const args = [''];
  spawn(command, args, { stdio: 'inherit' });
}

function init() {
  server
    .init()
    .then(function () {
      runVue();
    })
    .catch(console.error);
}

module.exports = { init };

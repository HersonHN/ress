
const { spawn } = require('child_process');
const server = require('./server');


if (require.main === module) {
  init();
}


function runWebpack() {
  const command = 'node_modules/webpack-dev-server/bin/webpack-dev-server.js';
  const args = '--inline --progress --config build/webpack.dev.conf.js'.split(' ');
  const webpack = spawn(command, args, { stdio: 'inherit' });
}


function init() {
  server.init()
  .then(function () {
    runWebpack();
  })
  .catch(console.error);
}


module.exports = { init };


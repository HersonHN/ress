
const server = require('./server');
const build = require('./build/build');


if (require.main === module) {
  init();
}


function init() {
  build.build()
    .then(server.init)
    .catch(console.error);
}


module.exports = { init };
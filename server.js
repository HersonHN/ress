
const server = require('./server/server');

if (require.main === module) {
  server.init();
}

module.exports = server;

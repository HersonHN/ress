'use strict';

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const ServerLoop = require('./server/server-loop');
const cleanPage = require('./server/scripts/clean');
const getFeeds = require('./server/scripts/get-feeds');
const sources = require('./sources.json');
const config = require('./server-config');

const publicPath = path.join(__dirname, 'dist');

const server = express();
const loop = new ServerLoop({ server, config });


server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(express.static(publicPath));


// rendering the index for each feed
server.get('/feed/:feedId', (req, res) => res.sendFile('index.html', { root: publicPath }));

server.get('/api/sources',  (req, res) => res.send(sources));

server.post('/api/feeds',     getFeeds);
server.get('/api/feed',     (req, res) => res.send(loop.cache.news));
server.get('/api/feed/:id', (req, res) => res.send(loop.cache.news[req.params.id]));

server.post('/api/clean',   cleanPage);



if (require.main === module || process.env.NODE_ENV == 'production') {
  loop.init();
  module.exports = { already: true };
} else {
  module.exports = {
    init: () => loop.init()
  };
}



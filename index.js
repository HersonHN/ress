'use strict';

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const sources = require('./sources');
const config = require('./server-config');
const Feeds = require('./server/scripts/get-feeds');
const ServerLoop = require('./server/server-loop');
const cleanPage = require('./server/scripts/clean');
const validateRSS = require('./server/scripts/validate-rss');

const publicPath = path.join(__dirname, 'dist');

const server = express();
const loop = new ServerLoop({ server, config });

server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(express.static(publicPath));

// rendering the index for each feed
server.get('/feed/:feedId', (req, res) => res.sendFile('index.html', { root: publicPath }));
server.get('/config', (req, res) => res.sendFile('index.html', { root: publicPath }));

server.get('/api/sources', (req, res) => res.send(sources));
server.get('/api/feed', (req, res) => Feeds.homepage(req, res, loop.cache));
server.get('/api/feed/:id', (req, res) => Feeds.single(req, res, loop.cache));
server.post('/api/feeds', (req, res) => Feeds.customHomepage(req, res, loop.cache));
server.post('/api/feeds/:id', (req, res) => Feeds.customSingle(req, res, loop.cache));

server.post('/api/clean', cleanPage);
server.post('/api/validate-rss', validateRSS);

if (process.env.NODE_ENV == 'production') {
  module.exports = { already: true };
} else {
  module.exports = {
    init: () => loop.init(),
  };
}

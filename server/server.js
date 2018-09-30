'use strict';

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const history = require('connect-history-api-fallback');
const fetch = require('node-fetch');
const Deferred = require('promise-deferred');

const rssParser = require('./scripts/rss-parser');
const sources = require('../sources.json');
const config = require('../server-config');

const server = express();
const publicPath = path.join(__dirname, '../dist');

const CACHE = {};


server.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(express.static(publicPath));
server.use(history());

server.get('/api/sources', function (req, res) {
  res.send(sources);
});


server.get('/api/feed', function (req, res) {
  res.send(CACHE.news);
});


server.get('/api/feed/:id', function (req, res) {
  let id = req.params.id;
  let sourceExists = CACHE.news[id];

  if (!sourceExists) {
    return res
      .status(500)
      .send({ error: 'Invalid feed id' });
  }

  res.send(CACHE.news[id]);
});


server.post('/api/clean', function (req, res) {
  let url = req.body.url;

  fetch(url)
    .then(res => res.text())
    .then(function (text) {
      res.send(text);
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).send('<strong class="error">Cannot read page<strong>');
    });

});


function init() {
  let def = new Deferred();

  setInterval(getNews, config.updateInterval);

  getNews(1).then(function () {
    server.on('error', function (e) {
      def.reject(e);
    });
    server.listen(config.port, function () {
      console.log(`Server running at port ${config.port}`);
      def.resolve({ ready: true });
    });
  });

  return def.promise;
}


function getNews(fistTime) {
  if (!fistTime) console.log('Updating news');

  return rssParser.getRSS()
    .then(feeds => CACHE.news = feeds)
    .catch(console.error);
}


if (require.main === module) {
  init();
}

module.exports = { init };

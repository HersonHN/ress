'use strict';

const express = require('express');
const rssParser = require('./scripts/rss-parser');
const sources = require('./sources.json');
const config = require('./server-config.json');

const server = express();
const CACHE = {};


server.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


server.get('/api/sources', function (req, res) {
  res.send(sources);
});


server.get('/api/feed', function (req, res) {
  res.send(CACHE.news);
});


server.get('/api/feed/:id', function (req, res, next) {
  let id = req.params.id;
  let sourceExists = CACHE.news[id];

  if (!sourceExists) {
    return res
      .status(500)
      .send({ error: 'Invalid feed id' });
  }

  res.send(CACHE.news[id]);
});


function init() {
  setInterval(getNews, config.updateInterval);

  getNews(1).then(function () {
    server.listen(config.port, function () {
      console.log(`Running at port ${config.port}`);
    });
  });
}


function getNews(fistTime) {
  if (!fistTime) console.log('Updating news');

  return rssParser.getRSS()
    .then(feeds => CACHE.news = feeds)
    .catch(console.error);
}


init();

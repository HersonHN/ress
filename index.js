'use strict';

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const rssParser = require('./server/scripts/rss-parser');
const sources = require('./sources.json');
const config = require('./server-config');

const server = express();
const publicPath = path.join(__dirname, 'dist');
console.log('publicPath', publicPath);

const CACHE = {};

server.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());


// rendering the index
server.get('/feed/:feedId', function (req, res) {
  res.sendFile('index.html', { root: publicPath });
});


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

  axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.2; +http://www.google.com/bot.html)'
      }
    })
    .then(res => res.data)
    .then(function (text) {
      res.send(text);
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).send('<strong class="error">Cannot read page<strong>');
    });

});


function init() {
  setInterval(getNews, config.updateInterval);

  return getNews(1)
    .then(function () {
      server.listen(config.port, function () {
        console.log(`Server running at port ${config.port}`);
      });
    });
}


function getNews(fistTime) {
  if (!fistTime) console.log('Updating news');

  return rssParser.getRSS()
    .then(feeds => CACHE.news = feeds)
    .catch(console.error);
}


if (require.main === module || process.env.NODE_ENV == 'production') {
  init();
  module.exports = { already: true };
} else {
  module.exports = { init };
}



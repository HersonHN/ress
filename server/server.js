'use strict';

const express = require('express');

const rssParser = require('./scripts/rss-parser');
var sources = require('./sources.json');


const server = express();


server.get('/api/feed/', function (req, res) {
  rssParser.getRSS()
    .then(feeds => res.send(feeds))
    .catch(e => {
      res.status(500).send({ error: 'Feed Error' });
      console.error(e);
    });
});


server.get('/api/feed/:id', function (req, res, next) {

  let id = req.params.id;
  let sourceExists = sources.find(s => s.id == id);

  if (!sourceExists) {
    res.status(500);
    res.send({ error: 'Invalid feed id' });
    return;
  }

  rssParser.getRSS()
    .then(feeds => res.send(feeds[id]))
    .catch(e => {
      res.sendStatus(500).send({ error: 'Feed Error' });
      console.error(e);
    });
});


server.listen(3100, function () {
  console.log('running at port 3100');
});


const rssParser = require('./rss-parser');
const defaults = require('./../../sources');

module.exports = {
  single,
  homepage,
  customHomepage,
}

function single(req, res, cache) {
  let content = cache.news[req.params.id];
  if (!content) {
    res.status(500)
      .send({ error: 'Invalid feed id' });
    return;
  }
  res.send(content)
}


function homepage(req, res, cache) {
  return res.send(cache.news);
}


function customHomepage(req, res, cache) {
  let feeds = req.body.feeds;

  if (feeds.length > defaults.length) {
    return res.status(413).send({ error: 'Payload Too Large'})
  }

  let cached = [];
  let notCached = [];

  // there's no need to load again already cached feeds
  cached = feeds.filter(feed => !!cache.news[feed.id]);
  cached = cached.map(feed => Promise.resolve(cache.news[feed.id]));

  // the not cached feed are loaded with the rss parser
  notCached = feeds.filter(feed => !cache.news[feed.id]);
  notCached = notCached.map(feed => rssParser.parseSingleFeed(feed));

  // both groups are handled by the same promise
  Promise.all([...cached, ...notCached])
    .then(feeds => rssParser.mergeFeeds(feeds))
    .then(content => res.json(content))
    .catch(e => console.error(e));
};


const rssParser = require('./rss-parser');

module.exports = function (req, res) {
  let feeds = req.body.feeds;

  if (feeds.length > 7) {
    return res.status(413).send({ error: 'Payload Too Large'})
  }

  rssParser.getRSS(feeds)
    .then(content => res.json(content))
    .catch(e => console.error(e));
};
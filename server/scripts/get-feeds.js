
const rssParser = require('./rss-parser');

module.exports = function (req, res) {
  let feeds = req.body.feeds;

  rssParser.getRSS(feeds)
    .then(content => res.json(content))
    .catch(e => console.error(e));
};
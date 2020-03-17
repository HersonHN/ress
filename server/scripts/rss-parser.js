
const Parser = require('rss-parser');


const sources = require('../../sources.json');
const parser = new Parser();


main();


function main() {
  if (require.main === module) {
    getRSS().then(function (news) {
      console.log(JSON.stringify(news, null, 4));
    });
  }
}


function getRSS() {
  let promiseList = sources.map(parseFeed);
  return Promise.all(promiseList)
    .then(feeds => mergeFeeds(feeds, sources));
}


function parseFeed(source) {
  return parser.parseURL(source.feed)
    .then(parsed => parsed.items)
    .catch(err => ({
      message: `cannot parse feed: ${source.feed}`,
      error: err
    }))
}


function mergeFeeds(feeds, sources) {
  var response = {};

  sources.forEach(function (source, index) {
    let feed = feeds[index];

    feed = sanitizeFeed(feed, source.id);

    response[source.id] = {
      id: source.id,
      title: source.title,
      rss: source.feed,
      icon: source.icon,
      feed: feed
    };
  });

  return response;
}


function sanitizeFeed(feed, feedId) {
  return feed.map(function (entry) {
    return {
      feedId: feedId,
      title: entry.title,
      link: entry.link,
      date: +(new Date(entry['dc:date'] || entry.pubDate))
    }
  });
}


module.exports = { getRSS };

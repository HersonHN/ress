
const Parser = require('rss-parser');
const moment = require('moment');

const sources = require('../../sources.json');


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
    .then(feeds => mergeFeeds(feeds, sources))
}


function parseFeed(source) {
  let parser = new Parser({
    timeout: 5000
  });

  return new Promise(resolve => {
    parser.parseURL(source.feed)
      .then(parsed => resolve(parsed.items))
      .catch(err => resolve({
        message: `cannot parse feed: ${source.feed}`,
        error: err
      }))
  })
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
  if (feed.error) {
    console.warn(feed.error);
    return [];
  }

  return feed.map(function (entry) {
    let dateOrigin = entry['dc:date'] || entry.pubDate;

    let m = moment(dateOrigin);
    let isValid = (dateOrigin && m.isValid());
    let isoDate = m.toISOString();

    return {
      feedId: feedId,
      title: entry.title,
      link: entry.link,
      date: isValid ? isoDate : ''
    }
  });
}

module.exports = { getRSS };

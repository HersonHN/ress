
const Deferred = require('promise-deferred');
const parser = require('rss-parser');

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
    .then(feeds => mergeFeeds(feeds, sources));
}


function parseFeed(source) {
  var deferred = new Deferred();

  parser.parseURL(source.feed, function(err, parsed) {
    if (err) return deferred.reject(err);
    deferred.resolve(parsed.feed.entries);
  });

  return deferred.promise;
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


const Deferred = require('promise-deferred');
const parser = require('rss-parser');

const sources = require('../sources.json');


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
    if (err) deferred.reject(err);
    deferred.resolve(parsed.feed.entries);
  });

  return deferred.promise;
}


function mergeFeeds(feeds, sources) {

  return sources.map(function (source, index) {
    let feed = feeds[index];

    source.feed = sanitizeFeed(feed);
    return source;
  });

}


function sanitizeFeed(feed) {
  return feed.map(function (entry) {
    return {
      title: entry.title,
      link: entry.link,
      date: +(new Date(entry.pubDate))
    }
  });
}


module.exports = getRSS;

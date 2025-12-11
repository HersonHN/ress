const Parser = require('rss-parser');
const moment = require('moment');

const defaultSources = require('../../sources');

main();

function main() {
  if (require.main === module) {
    getRSS().then(function (news) {
      console.log(JSON.stringify(news, null, 4));
    });
  }
}

function getRSS(sources) {
  sources = sources || defaultSources;

  let feeds = sources.map(({ id, url }) => ({ id, url }));
  let promiseList = feeds.map((feed) => parseSingleFeed(feed));

  return Promise.all(promiseList).then((feeds) => mergeFeeds(feeds));
}

function parseSingleFeed(feed) {
  let parser = new Parser({
    timeout: 5000,
  });

  return new Promise((resolve) => {
    parser
      .parseURL(feed.url)
      .then((body) =>
        sanitizeFeed({
          feed: feed,
          feedBody: body,
        }),
      )
      .then((items) => resolve(items))
      .catch((err) =>
        resolve({
          id: feed.id,
          feed: [],
          message: `cannot parse feed: ${feed.url}`,
          error: err,
        }),
      );
  });
}

function sanitizeFeed({ feedBody, feed }) {
  if (feedBody.error) {
    console.warn(feedBody.error);
    return [];
  }

  let items = feedBody.items.map((entry) => sanitizeEntry(entry, feed));

  return {
    id: feed.id,
    feed: items,
  };
}

function sanitizeEntry(entry, feed) {
  let dateOrigin = entry['dc:date'] || entry.pubDate;

  let m = moment(dateOrigin);
  let isValid = dateOrigin && m.isValid();
  let isoDate = m.toISOString();

  return {
    feedId: feed.id,
    title: entry.title,
    link: entry.link,
    date: isValid ? isoDate : '',
  };
}

function mergeFeeds(feedBodies) {
  var response = {};

  feedBodies.forEach(function (feed, index) {
    response[feed.id] = feedBodies[index];
  });

  return response;
}

module.exports = { getRSS, mergeFeeds, parseSingleFeed };

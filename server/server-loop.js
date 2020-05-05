
const rssParser = require('./scripts/rss-parser');

class ServerLoop {
  CACHE = { news: {} };

  constructor({ config, server }) {
    this.config = config;
    this.server = server;
  }

  get cache() {
    return this.CACHE;
  }


  loopNews(fistTime) {
    if (!fistTime) console.log('Updating news');

    return rssParser.getRSS()
      .then(feeds => this.updateCache(feeds, fistTime))
      .catch(console.error);
  }

  updateCache(allFeeds, fistTime) {
    if (fistTime) {
      this.CACHE.news = allFeeds;
      return;
    }

    Object.entries(allFeeds).forEach(([key, entry]) => {
      // only copy the feeds with entries
      // in case there was an error reading the rss, the entry.feed comes as an empty array.
      if (entry.feed && entry.feed.length) {
        this.CACHE.news[key] = entry;
      }
    })
  }

  listen() {
    this.server.listen(this.config.port, () => this.ready())
  }

  ready() {
    console.log(`Server running at port ${this.config.port}`);
    setInterval(() => this.loopNews(false), this.config.updateInterval);
  }

  init() {
    return this.loopNews(true)
      .then(() => this.listen());
  }
}

module.exports = ServerLoop;

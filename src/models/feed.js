import config from './api-config'
import reqwest from 'reqwest';

export default {

  getAll() {
    return reqwest(config.routes.feed);
  },

  get(site) {
    return reqwest(`${config.routes.feed}/${site}`);
  },

  mergeAll(sources) {
    let allFeeds = [];

    for (let sourceId in sources) {
      if (sources.hasOwnProperty(sourceId)) {
        let source = sources[sourceId];
        allFeeds = allFeeds.concat(source.feed);
      }
    }

    return allFeeds.sort((entryA, entryB) => entryB.date - entryA.date );
  }

}

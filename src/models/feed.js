import config from './api-config'
import axios from 'axios';

export default {

  getAll() {
    return axios.get(config.routes.feed)
      .then(response => response.data);
  },

  get(site) {
    return axios.get(`${config.routes.feed}/${site}`)
      .then(response => response.data);
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

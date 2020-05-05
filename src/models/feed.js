import config from './api-config'
import axios from 'axios';
import { get } from '../helpers/storage';

export default {

  getAll() {
    let sources = get('sources');

    if (!sources) {
      return axios.get(config.routes.feed)
        .then(response => response.data);
    }

    let feeds = sources.map(({ id, url }) => ({ id, url }));

    return axios.post(config.routes.feeds, { feeds })
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

    allFeeds = allFeeds.sort((entryA, entryB) => {
      let dateA = entryA.date ? (+(new Date(entryA.date))) : 0;
      let dateB = entryB.date ? (+(new Date(entryB.date))) : 0;

      return dateB - dateA;
    });

    return allFeeds;
  }

}

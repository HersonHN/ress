import axios from 'axios';
import config from './api-config';
import { get } from '@/helpers/storage';

export default {

  getAll() {
    let sources = get('sources');

    if (!sources) {
      return axios.get(config.routes.feed)
        .then(response => response.data);
    }

    return this.getCustom();
  },

  get(site) {
    let sources = get('sources');

    if (!sources) {
      return axios.get(`${config.routes.feed}/${site}`)
        .then(response => response.data);
    }

    return this.getCustom(site);
  },

  getCustom(fiterBy) {
    let feeds = sources
      // fiter if there's a single feed to show (on filterBy)
      .filter(feed => !fiterBy || feed.id === fiterBy)
      // send just the id and url
      .map(({ id, url }) => ({ id, url }));

    return axios.post(config.routes.feeds, { feeds })
      .then(response => fiterBy ? response.data[fiterBy] : response.data);
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
  },

  validateRSS(url) {
    return axios.post(config.routes.validateRSS, { url })
      .then(response => response.data);
  }

}

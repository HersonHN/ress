import axios from 'axios';
import config from './api-config';
import { get, set } from '../helpers/storage';
import { ArticleAPI, FeedAPI, Source, TotalFeedAPI, ValidateAPI } from '../types';

export default {
  async getAll() {
    let sources = get('sources');

    if (!sources) {
      const response = await axios.get<TotalFeedAPI>(config.routes.feed);

      return response.data;
    }

    return (await this.getCustom()) as TotalFeedAPI;
  },

  async get(site: string) {
    let sources = get('sources');

    if (!sources) {
      const response = await axios.get<FeedAPI>(`${config.routes.feed}/${site}`);
      return response.data;
    }

    return (await this.getCustom(site)) as FeedAPI;
  },

  async getCustom(fiterBy?: string) {
    const sources = get('sources') as Source[];
    const feeds = sources
      // fiter if there's a single feed to show (on filterBy)
      .filter((feed) => !fiterBy || feed.id === fiterBy)
      // send just the id and url
      .map(({ id, url }) => ({ id, url }));

    const response = await axios.post<TotalFeedAPI>(config.routes.feeds, { feeds });
    return fiterBy ? (response.data[fiterBy] as FeedAPI) : response.data;
  },

  mergeAll(sources: TotalFeedAPI) {
    let allFeeds: ArticleAPI[] = [];

    for (let sourceId in sources) {
      if (sources.hasOwnProperty(sourceId)) {
        let source = sources[sourceId];
        allFeeds = allFeeds.concat(source.feed);
      }
    }

    allFeeds = allFeeds.sort((entryA, entryB) => {
      let dateA = entryA.date ? +new Date(entryA.date) : 0;
      let dateB = entryB.date ? +new Date(entryB.date) : 0;

      return dateB - dateA;
    });

    return allFeeds;
  },

  async validateRSS(url: string) {
    const response = await axios.post<ValidateAPI>(config.routes.validateRSS, { url });
    return response.data;
  },
};

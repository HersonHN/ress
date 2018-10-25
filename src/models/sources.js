import config from './api-config';
import reqwest from 'reqwest';

let cache = {};

export default {

  get() {
    return reqwest(config.routes.sources)
      .then((sources) => {
        cache.sources = sources;
        return sources;
      });
  },

  getCached() {
    return cache.sources || [];
  },

}

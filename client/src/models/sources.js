import config from '../../api-config'

let cache = {};

export default {

  get() {
    return $.getJSON(config.routes.sources)
      .then((sources) => {
        cache.sources = sources;
        return sources;
      });
  },

  getCached() {
    return cache.sources || [];
  },

}

import config from '../../api-config.json'

export default {

  getAll() {
    return $.getJSON(config.routes.feed);
  },

  get(site) {
    return $.getJSON(`${config.routes.feed}/${site}`);
  },

  mergeAll(sources) {
    let allFeeds = [];

    for (let sourceId in sources) {
      if (sources.hasOwnProperty(sourceId)) {
        let source = sources[sourceId];
        allFeeds = allFeeds.concat(source.feed);
      }
    }

    return allFeeds.sort(entry => -entry.date );
  }

}

import config from '../../api-config.json'

export default {

  get() {
    return $.getJSON(config.routes.sources);
  }

}

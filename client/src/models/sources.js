import config from '../../api-config'

export default {

  get() {
    return $.getJSON(config.routes.sources);
  }

}

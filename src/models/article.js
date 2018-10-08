import config from './api-config'

export default {

  get(url) {
    return $.post(config.routes.article, { url: url });
  }

}

import config from '../../api-config.json'

export default {

  get(url) {
    return $.post(config.routes.article, { url: url });
  }

}

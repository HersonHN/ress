import config from './api-config'
import reqwest from 'reqwest';

export default {

  get(url) {
    return reqwest({
      url: config.routes.article,
      method: 'post',
      data: { url: url }
    });
  }

}

import config from './api-config';
import reqwest from 'reqwest';
import parse from 'url-parse';

const TEMPLATES = {
  youtube: {
    idRegex: /(?:embed\/|v=)((\w|-){11})((\S+)?)/,
    template: (id) => `<iframe src="//www.youtube.com/embed/${id}" width="640" height="480" frameborder="0" allowfullscreen="allowfullscreen"></iframe>`
  }
}

export default {

  get(url) {
    return reqwest({
      url: config.routes.article,
      method: 'post',
      data: { url: url }
    });
  },

  isVideo(url) {
    let checkers = [isYoutube];
    let finalResult = {}

    checkers.forEach(function(checker) {
      let result = checker(url);
      if (result.is) {
        finalResult = result;
        return -1;
      }
    })

    return finalResult;
  },

  formatVideo(result) {
    let {type, id} = result;
    let template = TEMPLATES[type].template;

    return template(id);
  }

}

function isYoutube(url) {
  let parsed = parse(url);
  let youtubeRegex = TEMPLATES.youtube.idRegex;

  let host = ((parsed.hostname.indexOf('youtube.com') > -1) ||
              (parsed.hostname.indexOf('youtu.be') > -1));
  let matchId = youtubeRegex.test(url);

  let matches = url.match(youtubeRegex);

  return {
    type: 'youtube',
    is: (host && matchId),
    id: getYoutubeId(matches)
  };
}

function getYoutubeId(matches) {
  if (!matches) return '';
  
  let [id] = matches;
  if (!id) return '';

  return id.replace('embed/', '').replace('v=', '');
}
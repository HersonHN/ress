import config from './api-config';
import axios from 'axios';
import parse from 'url-parse';

type VideoProvider = 'youtube';

const TEMPLATES: Record<VideoProvider, { idRegex: RegExp; template: (id: string) => string }> = {
  youtube: {
    idRegex: /(?:embed\/|v=)((\w|-){11})((\S+)?)/,
    template: (id: string) =>
      `<iframe src="//www.youtube.com/embed/${id}" width="640" height="480" frameborder="0" allowfullscreen="allowfullscreen"></iframe>`,
  },
};

type ParsedVideo = {
  type: VideoProvider;
  is: boolean;
  id: string;
};

async function get(url: string) {
  const response = await axios.post<string>(config.routes.article, { url: url });
  return response.data;
}

function isVideo(url: string): ParsedVideo | null {
  const checkers = [isYoutube];
  let finalResult: ParsedVideo | null = null;

  checkers.forEach(function (checker) {
    const result = checker(url);
    console.log('isVideo checker result', result);
    if (result.is) {
      finalResult = result;
      return -1;
    }
  });

  return finalResult;
}

function formatVideo(result: ParsedVideo) {
  const { type, id } = result;
  const template = TEMPLATES[type].template;

  return template(id);
}

function isYoutube(url: string): ParsedVideo {
  let parsed = parse(url);
  let youtubeRegex = TEMPLATES.youtube.idRegex;

  let host =
    parsed.hostname.indexOf('youtube.com') > -1 || parsed.hostname.indexOf('youtu.be') > -1;
  let matchId = youtubeRegex.test(url);

  let matches = url.match(youtubeRegex);

  return {
    type: 'youtube',
    is: host && matchId,
    id: getYoutubeId(matches),
  };
}

function getYoutubeId(matches: RegExpMatchArray | null) {
  if (!matches) return '';

  let [id] = matches;
  if (!id) return '';

  return id.replace('embed/', '').replace('v=', '');
}

export { get, isVideo, formatVideo };

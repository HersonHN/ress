
import defaultSources from '../sources';
import { get } from './helpers/storage';
import * as firebase from './helpers/firebase';

const main = {};

main.preinit = function () {
  let theme = get('theme') || 'system';

  main.setTheme(theme);
  window.sources = main.sources();
};

main.sources = function (option) {
  if (option == 'default') {
    return defaultSources;
  }

  return get('sources') || defaultSources;
};

main.setTheme = function (theme) {
  theme = `${theme}-theme`;

  let body = document.body;
  body.classList.remove(...body.classList);
  body.classList.add(theme);
}



export default main;

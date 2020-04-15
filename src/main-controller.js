
import defaultSources from '../sources';
import { get } from './helpers/storage';

const main = {};

main.preinit = function () {
  let theme = get('theme');

  main.setTheme(theme);
  window.sources = main.sources();
};

main.sources = function () {
  return get('sources') || defaultSources;
};

main.setTheme = function (theme) {
  theme = `${theme}-theme`;

  let body = document.body;
  body.classList.remove(...body.classList);
  body.classList.add(theme);
}



export default main;

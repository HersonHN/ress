
import defaultSources from '../sources.json';
import { get } from './helpers/storage';
const main = {};

main.preinit = function () {
  window.sources = main.sources();
};

main.sources = function () {
  return get('sources') || defaultSources;
};



export default main;


import defaultSources from '../sources.json'; 
const main = {};

main.preinit = function () {
  window.sources = main.sources();
};

main.sources = function () {
  let sources = localStorage.sources;
  if (!sources) sources = defaultSources;

  return sources;
};

export default main;

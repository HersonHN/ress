import { defaultSources } from './sources';
import { get, set } from './helpers/storage';
import type { Source } from './types';

const defaults = defaultSources();

const main = {
  preinit: function () {
    const theme = get<string>('theme') || 'system';
    main.setTheme(theme);
  },

  setTheme: function (theme: string) {
    theme = `${theme}-theme`;
    let body = document.body;
    body.classList.remove(...Array.from(body.classList));
    body.classList.add(theme);
  },

  sources: async (option = '') => {
    if (option == 'default') {
      return defaults;
    }

    const stored = get<Source[]>('sources');
    if (!stored) {
      set('sources', defaults);
      return defaults;
    }

    return get<Source[]>('sources');
  },
};

export default main;

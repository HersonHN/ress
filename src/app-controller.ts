import { defaultSources } from './sources';
import { get, set } from './helpers/storage';
import type { Source } from './types';
import mitt from 'mitt';

const emitter = mitt<{ 'sources:updated': Source[] }>();

const main = {
  emitter,

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

  sources: async (option: 'default' | '' = '') => {
    if (option == 'default') {
      return defaultSources();
    }

    const stored = get<Source[]>('sources');
    if (!stored) {
      const defaults = defaultSources();
      set('sources', defaults);
      return defaults;
    }

    return get<Source[]>('sources');
  },
};

export default main;

<template>
  <section class="config-section">
    <h2 class="title">Configurations</h2>

    <section class="fields">
      <fieldset>
        <legend>
          <h3>Theme:</h3>
        </legend>

        <div v-for="t in themeList" :key="t.id">
          <label class="fg-color theme-label">
            <input type="radio" name="theme" v-model="theme" @change="changeTheme" :value="t.id" />
            <span>{{ t.name }}</span>
          </label>
        </div>
      </fieldset>
    </section>

    <section class="fields">
      <div v-if="!alreadyLoaded" class="callout primary">
        <p>Sync your news feeds across devices:</p>
        <p>
          <button class="button" @click="loadFromFirebase">Load feeds</button>
        </p>
      </div>

      <fieldset>
        <legend>
          <h3>Feeds:</h3>
        </legend>

        <component-list
          :value="feedList"
          #default="{ item }"
          :key="controlNumber"
          @updated="updateList"
        >
          <label v-if="item.value.default" class="feed-name-preview fg-color flex">
            <span class="feed-icons flex-shrink">
              <input
                type="checkbox"
                :checked="item.value.selected"
                @change="
                  (event) => (item.value.selected = (event.target as HTMLInputElement).checked)
                "
                :disabled="selectedCount() <= 1 && item.value.selected"
              />
              <img class="feed-icon mini" :src="item.value.icon" />
            </span>
            <span class="flex-grow">{{ item.value.title }}</span>
          </label>

          <span v-if="!item.value.default">
            <custom-feed
              :value="item.value"
              @updated="item.value = $event"
              @invalid="item.value.invalid = true"
              @valid="item.value.invalid = false"
            />
          </span>
        </component-list>
      </fieldset>
    </section>

    <section class="fields">
      <fieldset class="buttons">
        <button class="save button" @click="saveFeeds()">Save Feeds</button>
        <button class="button hollow" @click="reset()">Reset Feeds</button>
      </fieldset>
    </section>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import * as firebase from '@/helpers/firebase';
import * as storage from '@/helpers/storage';
import type { Source } from '../../types';

import app from '@/app-controller';
import Feed from '@/models/feed';

import ComponentList from './component-list.vue';
import CustomFeed from './custom-feed.vue';

type SourceExt = Source & {
  required?: boolean;
  default?: boolean;
  selected?: boolean;
  invalid?: boolean;
};

const config = {
  maxFeeds: 10,
};

const router = useRouter();

const alreadyLoaded = ref(false);
const theme = ref('');
const themeList = ref([
  { id: 'system', name: 'System Default' },
  { id: 'light', name: 'Light' },
  { id: 'dark', name: 'Dark' },
]);
const feedList = ref<SourceExt[]>([]);
const controlNumber = ref(0);

onMounted(async () => {
  theme.value = storage.get('theme') || 'system';

  firebase.init();
  await displayFeeds();
  controlNumber.value++;
});

const changeTheme = () => {
  app.setTheme(theme.value);
  storage.set('theme', theme.value);
};

const displayFeeds = async () => {
  const defaultFeeds = await app.sources('default');
  const savedFeeds = (await app.sources()) as SourceExt[];

  const defaults = defaultFeeds.map((feed) => {
    const isSelected = Boolean(savedFeeds.find((sf) => sf.id === feed.id));

    const instance: SourceExt = {
      ...feed,
      selected: isSelected,
      required: true,
      default: true,
    };

    return instance;
  });

  const saved = savedFeeds.map((feed) => {
    const isFromDefaults = Boolean(defaultFeeds.find((df) => df.id === feed.id));

    const instance: SourceExt = {
      ...feed,
      selected: isFromDefaults,
      required: isFromDefaults,
      default: isFromDefaults,
    };

    return instance;
  });

  const notSelected = defaults.filter((df) => df.selected === false);

  feedList.value = [...saved, ...notSelected];
};

const selectedCount = () => {
  let count = feedList.value.reduce((count, item) => (item.default ? count + 1 : count), 0);
  return count;
};

const updateList = (list: SourceExt[]) => {
  if (!list) {
    feedList.value = [];
  }
  const newList = list.map((item) => ({ ...item }));
  feedList.value = newList;
};

const loadFromFirebase = async () => {
  try {
    const data = await firebase.loadFeeds();

    if (!data) return;
    if (!data.sources) return;
    if (!data.sources.length) return;

    const firebaseSources = data.sources.map((x) => ({ ...x }));

    let count = firebaseSources.length;
    let response = confirm(`${count} news feeds found on your account, do you want to load them?`);
    if (!response) return;

    storage.set('sources', firebaseSources);

    displayFeeds();

    controlNumber.value++;
    alreadyLoaded.value = true;
  } catch (error: any) {
    if (error?.code == 'auth/web-storage-unsupported') {
      alert(
        "It seems like your browser doesn't allow third party cookies \n" +
          'which are necessary to load the feeds on your google account. \n' +
          'Check online how to enable third party cookies and try again.',
      );
    }
  }
};

const prepare = () => {
  let customCount = 1;

  feedList.value = feedList.value
    .filter(({ title, url, icon }) => title || url || icon)
    .map<SourceExt>((feed) => {
      if (feed instanceof Feed) {
        feed = feed.toOBJ();
      }

      if (!feed.default) {
        feed.selected = true;
        feed.id = `custom-${customCount}`;
        customCount++;
      }

      return feed as SourceExt;
    });
};

const validate = () => {
  prepare();

  for (let feed of feedList.value) {
    if (feed.invalid) {
      console.warn('invalid feed', feed);
      alert('Please make sure all feeds are valid before save');
      return false;
    }
  }

  let feeds = feedList.value.filter((f) => f.selected);
  if (feeds.length > config.maxFeeds) {
    alert(`Please don't choose more than ${config.maxFeeds} feeds`);
    return false;
  }

  return true;
};

const saveFeeds = () => {
  if (!validate()) return;

  let feeds = feedList.value
    .filter((f) => f.selected)
    .map<SourceExt>(({ id, title, url, icon }) => ({ id, title, url, icon }));

  storage.set('sources', feeds);

  firebase
    .saveFeeds({ sources: feeds })
    .then(() => {
      // redirecting to home after save
      app.emitter.emit('sources:updated', feeds);
      router.push({ name: 'all-feeds' });
    })
    .catch((error) => {
      if (error.code == 'auth/web-storage-unsupported') {
        alert(
          "It seems like your browser doesn't allow third party cookies \n" +
            'which are necessary to save the feeds on your google account. \n' +
            'Check online how to enable third party cookies and try again.',
        );
      }
    });
};

const reset = async () => {
  let defaultFeeds = ((await app.sources('default')) as SourceExt[]).map((df) => {
    df.selected = true;
    df.required = true;
    df.default = true;

    return df;
  });

  feedList.value = defaultFeeds;

  controlNumber.value++;

  if (confirm('Feed list reversed to default, do you want to save?')) {
    saveFeeds();
  }
};
</script>

<style lang="scss" scoped>
.config-section {
  padding: 1rem;

  section.fields {
    margin-bottom: 1rem;
    margin-top: 2rem;
  }

  .title {
    padding-bottom: 1rem;
  }

  .theme-label {
    display: inline-block;

    input {
      margin-bottom: 1rem;
      margin-right: 1rem;
    }
  }

  .feed-name-preview {
    vertical-align: middle;

    input {
      margin-right: 0.5rem;
      margin-bottom: 0;
    }

    .feed-icons {
      min-width: 3rem;
    }

    .feed-icon.mini {
      display: inline-block;
      margin-right: 0.5rem;
    }
  }

  .buttons {
    button {
      margin-right: 1rem;
    }
  }
}
</style>

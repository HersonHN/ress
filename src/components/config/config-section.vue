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
            <input type="radio" name="theme" v-model="theme" @change="changeTheme" :value="t.id">
            <span>{{ t.name }}</span>
          </label>
        </div>

      </fieldset>
    </section>

    <section class="fields">

      <div class="callout primary">
        <p>Sync your news feeds across devices:</p>
        <p>
          <button class="button" @click="load">Load feeds</button>
        </p>
      </div>

      <fieldset>
        <legend>
          <h3>Feeds:</h3>
        </legend>

        <component-list
            v-model="feedList"
            #default="{ item }"
            :key="controlNumber"
        >
            <label class="feed-name-preview fg-color flex" v-if="item.value.default">
              <span class="feed-icons flex-shrink">
                <input type="checkbox"
                    v-model="item.value.selected"
                    :disabled="(selectedCount() <= 1) && item.value.selected">
                <img class="feed-icon mini" :src="item.value.icon">
              </span>
              <span class="flex-grow">{{item.value.title}}</span>
            </label>

            <span v-if="!item.value.default">
              <custom-feed v-model="item.value"></custom-feed>
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


<script>
import * as firebase from '@/helpers/firebase';
import * as storage from '@/helpers/storage';
import event from '@/helpers/event';

import app from '@/app-controller';
import Feed from '@/models/feed';

import ComponentList from './component-list';
import CustomFeed from './custom-feed';


export default {
  name: 'ConfigSection',
  data () {
    return {
      showAlert: true,
      theme: storage.get('theme') || 'system',
      themeList: [
        { id: 'system', name: 'System Default' },
        { id: 'light', name: 'Light' },
        { id: 'dark', name: 'Dark' },
      ],
      feedList: [],
    }
  },

  components: {
    ComponentList,
    CustomFeed,
  },

  created() {
    this.loadFeeds();
    this.controlNumber = 0;
    firebase.init();

  },

  methods: {
    async load() {
      let data = await firebase.loadFeeds();

      if (!data) return;
      if (!data.sources) return;
      if (!data.sources.length) return;

      let count = data.sources.length;
      let response = confirm(`${count} news feeds found on your account, do you want to load them?`);
      if (!response) return;

      let feeds = data.sources;
      this.feedList = feeds;

      storage.set('sources', feeds);
      this.$root.$emit('sources:saved', feeds);

      this.controlNumber++;

      this.loadFeeds();
    },

    changeTheme() {
      app.setTheme(this.theme);
      storage.set('theme', this.theme);
    },

    selectedCount() {
      let count = this.feedList.reduce((count, item) => (item.selected ? count + 1 : count), 0);
      return count;
    },

    loadFeeds() {
      let defaultFeeds = clone(app.sources('default'));
      let loadedFeeds  = clone(app.sources());

      // the default feeds are the ones from sources.js
      // check with of them are loaded in the user's conf
      defaultFeeds.forEach(df => {
        let isSelected = !!loadedFeeds.find(f => df.id === f.id);
        df.selected = isSelected;
        df.required = true;
        df.default = true;
      });

      // mark with of the user's feed are from the defaults
      loadedFeeds.forEach(feed => {
        let isFromDefaults = !!defaultFeeds.find(df => df.id === feed.id);
        feed.selected = isFromDefaults;
        feed.required = isFromDefaults;
        feed.default = isFromDefaults;
      });

      // select just the feed's that are not on the user's conf
      let notSelected = defaultFeeds.filter(df => df.selected == false);

      // first show all the feeds from the user configuration
      // and then show all the default feeds that are unselected
      let feeds = [...loadedFeeds, ...notSelected];
      this.feedList = feeds;
    },

    prepare() {
      let customCount = 1;

      this.feedList = this.feedList
        .filter(({ title, url, icon }) => title || url || icon)
        .map(feed => {
          if (feed instanceof Feed) {
            feed = feed.toOBJ();
          }

          if (!feed.default) {
            feed.selected = true;
            feed.id = `custom-${customCount}`;
            customCount++;
          }

          return feed;
      });
    },

    validate() {
      this.prepare();

      for (let feed of this.feedList) {
        if (feed.invalid) {
          console.warn('invalid feed', feed);
          return false;
        }
      }

      return true;
    },

    async saveFeeds() {
      if (!this.validate())
        return alert('Please make sure all feeds are valid before save');

      let feeds = this.feedList
        .filter(f => f.selected)
        .map(({id, title, url, icon}) => ({id, title, url, icon}));

      window.sources = feeds;
      storage.set('sources', feeds);
      this.$root.$emit('sources:saved', feeds);
      await firebase.saveFeeds({ sources: feeds });

      // redirecting to home after save
      this.$router.push({ name: 'all-feeds' });
    },

    reset() {
      let defaultFeeds = clone(app.sources('default'));
      defaultFeeds.forEach(df => df.selected = true);

      this.feedList = defaultFeeds;

      this.controlNumber++;

      if (confirm('Feed list reversed to default, do you want to save?')) {
        this.saveFeeds();
      }
    },
  },
}

function clone(obj) {
  let json = JSON.stringify(obj);
  return JSON.parse(json);
}

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
        margin-right: .5rem;
        margin-bottom: 0;
      }

      .feed-icons {
        min-width: 3rem;
      }

      .feed-icon.mini {
        display: inline-block;
        margin-right: .5rem;
      }
    }

    .buttons {
      button { margin-right: 1rem; }
    }
  }
</style>

<template>
  <section class="config-section">
    <h2 class="title">Configuration</h2>

    <section class="fields">
      <fieldset class="large-10 cell">
        <legend>Theme:</legend>

        <div v-for="t in themeList" :key="t.id">
          <label class="fg-color">
            <input type="radio" name="theme" v-model="theme" @change="changeTheme" :value="t.id">
            <span>{{ t.name }}</span>
          </label>
        </div>

      </fieldset>
    </section>

  </section>
</template>


<script>
import * as storage from '../helpers/storage';
import app from '../main-controller';

export default {
  name: 'ConfigSection',
  data () {
    return {
      theme: storage.get('theme'),
      themeList: [
        { id: 'system', name: 'System Default' },
        { id: 'light', name: 'Light' },
        { id: 'dark', name: 'Dark' },
      ]
    }
  },

  methods: {
    changeTheme() {
      app.setTheme(this.theme);
      storage.set('theme', this.theme);
    }
  },
}
</script>

<style lang="scss" scoped>
  .config-section {
    .title {
      padding: 1rem;
      margin-bottom: 0;
    }
    label {
      display: inline-block;
    }
    .fields { padding: 1rem; }
  }
</style>

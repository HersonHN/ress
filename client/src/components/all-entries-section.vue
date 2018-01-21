<template lang="html">
  <section class="all-entries">
    <h1>All Entries</h1>

    <div class="entry" v-for="entry in feed">
      <a :href="entry.link" target="_blank">{{ entry.title }}</a>
      <small>
        Site: {{ sources[entry.feedId].title }}
      </small>
    </div>
  </section>
</template>


<script>
import Feed from '@/models/feed';

export default {

  name: 'AllEntriesSection',

  data() {
    return { feed: [], sources: {} }
  },

  created() {
    Feed.getAll()
      .then(sources => {
        this.feed = Feed.mergeAll(sources)
        this.sources = sources;
      })
  }
}
</script>


<style lang="scss" scoped>
  .entry {
    padding: .5rem;
    border-top: 1px solid #ddd;

    small {
      display: inline-block;
      font-size: .4rem;
      color: #aaa;
    }
  }
</style>

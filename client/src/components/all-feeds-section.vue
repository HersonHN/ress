<template lang="html">
  <section class="all-feeds-section">
    <h2 class="title">All Entries</h2>

    <div class="entry" v-for="entry in feed">
      <feed-entry
        :entry="entry"
        :source-name="sources[entry.feedId].title"
      />
    </div>
  </section>
</template>


<script>
import Feed from '@/models/feed';
import FeedEntry from './feed-entry';

export default {
  name: 'AllFeedsSection',
  components: { FeedEntry },

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
@import "../assets/sass/init.scss";

.title {
  padding: 1rem;
  margin-bottom: 0;
}

.entry:last-child {
  .feed-entry {
    border-bottom: $gray-line;
  }
}
</style>

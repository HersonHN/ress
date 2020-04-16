<template lang="html">
  <section class="all-feeds-section">
    <h2 class="title">All Entries</h2>

    <div v-if="loading">
      <loading-animation />
    </div>

    <div class="entry" v-for="entry in feed" :key="entry.id">
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
import LoadingAnimation from '@/components/shared/loading-animation';;

export default {
  name: 'AllFeedsSection',
  components: { FeedEntry, LoadingAnimation },

  data() {
    return {
      loading: true,
      feed: [],
      sources: {}
    }
  },

  created() {
    Feed.getAll()
      .then(sources => {
        this.feed = Feed.mergeAll(sources)
        this.sources = sources;
      })
      .finally(() => {
        this.loading = false;
      })
  }
}
</script>


<style lang="scss" scoped>
@import "assets/sass/init.scss";

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

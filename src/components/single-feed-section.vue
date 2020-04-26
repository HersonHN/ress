<template lang="html">
  <section class="single-feed-section fg-color">
    <h2 class="title">
      <img class="feed-icon medium" :src="source.icon" :alt="source.title">
      {{ source.title }}
    </h2>

    <div v-if="loading">
      <loading-animation />
    </div>

    <div v-if="!loading && !feed.length">
      <p>¯\_(ツ)_/¯</p>
      <p>Nothing to show here.</p>
    </div>

    <div class="entry" v-for="entry in feed" :key="entry.id" v-if="feed">
      <feed-entry
        :entry="entry"
        :source-name="source.title"
      />
    </div>
  </section>
</template>


<script>
import Feed from '@/models/feed';
import FeedEntry from './feed-entry';
import LoadingAnimation from './loading-animation';

export default {
  name: 'AllFeedsSection',
  props: ['feedId'],
  components: { FeedEntry, LoadingAnimation },

  data() {
    return {
      loading: true,
      feed: [],
      source: {}
    }
  },

  created() {
    let feedId = this.$route.params.feedId;
    this.source = window.sources.find(s => s.id == feedId);

    Feed.get(feedId)
      .then(source => {
        this.feed = source.feed;
      }).finally(() => {
        this.loading = false;
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

.title img {
  margin-bottom: .25em;
}

.entry:last-child {
  .feed-entry {
    border-bottom: $gray-line;
  }
}

</style>

<template lang="html">
  <section class="single-feed-section">
    <h1>
      <img :src="source.icon" :alt="source.title">
      {{ source.title }}
    </h1>

    <div class="entry" v-for="entry in feed">
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

export default {
  name: 'AllFeedsSection',
  props: ['feedId'],
  components: { FeedEntry },

  data() {
    return { feed: [], source: {} }
  },

  created() {
    let feedId = this.$route.params.feedId;

    Feed.get(feedId)
      .then(source => {
        this.feed = source.feed;
        this.source = source;
      })
  }
}
</script>


<style lang="scss" scoped>
  h1 img {
    width: .75em;
    height: .75em;
    vertical-align: middle;
    margin-bottom: .25em;
  }

  .entry:last-child {
    .feed-entry {
      border-bottom: 1px solid #ddd;
    }
  }

</style>

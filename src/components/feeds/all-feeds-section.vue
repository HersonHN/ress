<template lang="html">
  <section class="all-feeds-section">
    <h2 class="title">All Entries</h2>

    <div v-if="loading">
      <loading-animation />
    </div>

    <div class="entry" v-for="entry in feed" :key="entry.feedId">
      <feed-entry :entry="entry" :sources="sources" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Feed from '@/services/feed';
import FeedEntry from './feed-entry.vue';
import LoadingAnimation from '@/components/shared/loading-animation.vue';
import main from '@/app-controller';
import type { ArticleAPI, Source } from '../../types';

const loading = ref(true);
const feed = ref<ArticleAPI[]>([]);
const sources = ref<Source[]>();

onMounted(async () => {
  sources.value = await main.sources();
  const response = await Feed.getAll();
  feed.value = Feed.mergeAll(response);

  loading.value = false;
});
</script>

<style lang="scss" scoped>
@use '@/assets/sass/init.scss' as *;

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

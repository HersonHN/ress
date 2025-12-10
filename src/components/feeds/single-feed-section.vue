<template lang="html">
  <section class="single-feed-section">
    <h2 class="title flex" v-if="source">
      <span class="flex-shrink">
        <img class="feed-icon medium" :src="source.icon" :alt="source.title" />
      </span>
      <span class="flex-grow">{{ source.title }}</span>
    </h2>

    <h2 class="title" v-if="notFound">This Feed doesn't exist</h2>

    <div v-if="loading">
      <loading-animation />
    </div>

    <div class="entry" v-if="!loading && !feed.length">
      <p>¯\_(ツ)_/¯</p>
      <p>Nothing to show here.</p>
    </div>

    <div class="entry" v-for="entry in feed" :key="entry.feedId" v-if="feed">
      <feed-entry :entry="entry" :sources="sourceList" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import Feed from '@/services/feed';
import FeedEntry from './feed-entry.vue';
import LoadingAnimation from '@/components/shared/loading-animation.vue';
import main from '@/app-controller';
import type { ArticleAPI, Source } from '../../types';

const loading = ref(true);
const notFound = ref(false);
const feed = ref<ArticleAPI[]>([]);
const sourceList = ref<Source[]>();
const source = ref<Source>();

const route = useRoute();

onMounted(async () => {
  sourceList.value = await main.sources();
  const feedId = String(route.params.feedId);
  source.value = sourceList.value.find((s) => s.id == feedId);

  if (!source.value) {
    notFound.value = true;
    loading.value = false;
    return;
  }

  const response = await Feed.get(feedId);
  feed.value = response.feed;
  loading.value = false;
});
</script>

<style lang="scss" scoped>
@use '@/assets/sass/init.scss' as *;

.title {
  padding: 1rem;
  margin-bottom: 0;
}

.title img {
  margin-bottom: 0.25em;
}

.entry:last-child {
  .feed-entry {
    border-bottom: $gray-line;
  }
}
</style>

<template>
  <section class="source-list">
    <router-link :to="{ name: 'config' }">
      <span class="icon-container">
        <i class="icon icon-cog-alt medium-size"></i>
      </span>
    </router-link>

    <router-link :to="{ name: 'all-feeds' }">
      <span class="icon-container">
        <i class="icon icon-home not-that-big"></i>
      </span>
    </router-link>

    <span v-for="source in sources" :key="source.id">
      <router-link :to="{ name: 'single-feed', params: { feedId: source.id } }">
        <figure :class="{ selected: source.id === selected }">
          <img
            class="feed-icon"
            width="72"
            height="72"
            :src="source.icon"
            :alt="source.title"
            :title="source.title"
          />
        </figure>
      </router-link>
    </span>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';

import type { Source } from '@/types';
import app from '@/app-controller';

const sources = ref<Source[]>();
const selected = ref<string>('');
const route = useRoute();

const highlightActive = () => {
  const feedId = route.params.feedId;

  selected.value = String(feedId);
};

watch(() => route.path, highlightActive);

const updateSources = async () => {
  sources.value = await app.sources();
};

onMounted(async () => {
  app.emitter.on('sources:updated', updateSources);

  await updateSources();
  highlightActive();
});

onUnmounted(() => {
  app.emitter.off('sources:updated', updateSources);
});
</script>

<style lang="scss" scoped>
.source-list {
  color: white;
  overflow-x: hidden;
  text-align: center;

  .icon-container {
    display: block;
    padding: 5px 0;
    color: white;
  }
  .icon-container:hover {
    color: #ddd;
  }

  .icon {
    font-size: 70px;
    line-height: 70px;

    &.not-that-big {
      font-size: 40px;
    }

    &.medium-size {
      font-size: 35px;
    }
  }
  a {
    display: inline-block;
  }
  figure {
    padding: 5px 10px;
    font-weight: bold;
    color: white;
    text-align: center;
  }

  img {
    border-radius: 4px;
    border: black 3px solid;
    background: black;
  }

  .selected img {
    border: white 3px solid;
  }
}
</style>

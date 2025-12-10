<template lang="html">
  <article class="feed-entry">
    <header :class="{ 'left-handed': leftHanded }">
      <img class="feed-icon mini" :alt="source().title" :src="feedIcon()" />

      <div class="title">
        <a :href="entry.link" target="_blank">{{ entry.title }}</a>
        <small>
          {{ webpage() }}
          <span class="date">{{ date(entry.date) }}</span>
        </small>
      </div>

      <a class="toggle" title="Show Preview" @click="togglePreview">
        <i v-if="!showPreview" class="icon-down-open"></i>
        <i v-if="showPreview" class="icon-up-open"></i>
      </a>
    </header>
    <article-preview v-if="showPreview" :show="showPreview" :entry="entry" @close="onClose" />
  </article>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import ArticlePreview from './article-preview.vue';
import type { ArticleAPI, Source } from '@/types';
import date from '@/filters/date';

const { entry, sources } = defineProps<{
  entry: ArticleAPI;
  sources: Source[];
}>();
const leftHanded = ref(false); // @TODO: set an option for this
const showPreview = ref(false);

const source = () => {
  const feed = entry.feedId;
  const source = sources.find((s) => s.id == feed);

  return (
    source ||
    ({
      id: '',
      title: '',
      url: '',
      icon: '',
    } as Source)
  );
};

const feedIcon = () => {
  return source().icon;
};

const webpage = () => {
  let url = entry.link;
  let domain = url.split('/')[2];
  let domainTokens = domain.split('.');

  if (domainTokens[0] == 'www') {
    domainTokens = domainTokens.slice(1);
    domain = domainTokens.join('.');
  }
  return domain;
};

const togglePreview = () => {
  showPreview.value = !showPreview.value;
};

const onClose = () => {
  showPreview.value = false;
};
</script>

<style lang="scss" scoped>
@use '@/assets/sass/init.scss' as *;

.feed-entry {
  display: block;
  border-top: $gray-line;

  header {
    display: flex;
    position: relative;
    align-items: center;
    min-height: 2.5rem;
    img {
      margin-left: 3px;
    }
  }

  .toggle {
    padding: 0.5rem;
    background: $grayish-bg;
    font-size: 1rem;
    color: $middlegray;
    align-self: stretch;
    display: flex;
    align-items: center;
  }

  header.left-handed .toggle {
    order: -1;
  }

  .title {
    padding: 0.5rem;
    line-height: 1.5rem;
    flex-grow: 1;

    small {
      margin-left: 0.5rem;
      display: inline-block;
      font-size: 0.65rem;
      color: $middlegray;
    }

    .date::before {
      content: ' | ';
    }

    .date:empty {
      display: none;
    }
  }
}
</style>

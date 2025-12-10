<template lang="html">
  <div class="preview" ref="container" v-if="preview">
    <div class="loading" v-if="!loaded">
      <loading-animation />
    </div>

    <div class="article-content" v-if="loaded" v-html="article"></div>

    <div class="control-buttons text-center" v-if="loaded">
      <a class="close-preview" @click="toggleAndScroll">
        <i class="icon-cancel"></i> Close Preview
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue';
import LoadingAnimation from '../shared/loading-animation.vue';
import * as Article from '../../services/article';
import ui from '../../helpers/ui';
import type { ArticleAPI } from '@/types';

import parser from 'cleanview';

const { show, entry } = defineProps<{
  show: boolean;
  entry: ArticleAPI;
}>();

const emit = defineEmits(['close']);

const preview = ref(false);
const loaded = ref(false);
const article = ref('');
const containerRef = useTemplateRef('container');

const togglePreview = () => {
  preview.value = !preview.value;

  if (!preview.value) return;

  const url = entry.link;
  presentContent(url);
};

const presentContent = (url: string) => {
  const result = Article.isVideo(url);
  if (result?.is) {
    let embed = Article.formatVideo(result);

    article.value = embed;
    loaded.value = true;
    return;
  }

  loaded.value = false;

  Article.get(url)
    .then((html) => {
      const cleanArticle: string = parser(html, {
        url: url,
        minRatio: 0.5,
        includeTags: ['header'],
      });

      article.value = cleanArticle;
      loaded.value = true;
    })
    .catch(() => {
      article.value = `<p>There was an error reading the page <a target="_blank" href="${url}">${url}</a></p>`;
      loaded.value = true;
    });
};

const scrollTop = () => {
  const parent = containerRef.value.parentNode as HTMLElement;
  ui.scrollTo(parent);
  ui.highlight(parent);
};

const toggleAndScroll = () => {
  scrollTop();
  setTimeout(() => {
    togglePreview();
    emit('close');
  }, 300);
};

onMounted(() => {
  preview.value = show;
  if (show) {
    presentContent(entry.link);
  }
});
</script>

<style lang="scss" scoped>
@use '@/assets/sass/init.scss' as *;

.preview {
  border-top: $gray-line;

  .article-content {
    padding: 1rem 2rem 2rem 2rem;
  }

  .control-buttons {
    border-top: $gray-line;
    margin-top: 1rem;

    .close-preview {
      background: $grayish-bg;
      display: block;
      padding: 1em;
    }
  }
}
</style>

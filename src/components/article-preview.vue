<template lang="html">
  <div class="preview" v-if="preview">
    <div class="loading"
        v-if="!loaded">
      <loading-animation/>
    </div>

    <div class="article-content"
        v-if="loaded"
        v-html="article">
    </div>

    <div class="control-buttons text-center"
        v-if="loaded">
      <a class="close-preview"
          @click="toggleAndScroll">
        <i class="icon-cancel"></i> Close Preview
      </a>
    </div>
  </div>
</template>


<script>
import parser from 'cleanview';
import LoadingAnimation from './loading-animation';
import Article from '../models/article';
import ui from '../helpers/ui';

export default {
  name: 'ArticlePreview',
  props: ['entry'],
  components: { LoadingAnimation },
  data() {
    return {
      preview: false,
      loading: false,
      loaded: false,
      article: ''
    }
  },

  methods: {
    togglePreview() {
      this.preview = !this.preview;

      if (this.preview == false) return;

      let url = this.entry.link;

      this.presentContent(url);
    },

    presentContent(url) {
      let result = Article.isVideo(url);
      if (result.is) {
        let embed = Article.formatVideo(result);

        this.article = embed;
        this.loaded = true;
        return;
      }

      Article.get(url).then((article) => {
        let cleanview = parser(article, {
          url: url,
          minRatio: 0.5,
          includeTags: ['header']
        });

        this.article = cleanview;
        this.loaded = true;
      })
    },

    scrollTop() {
      let element = this.$parent.$el;
      ui.scrollTo(element);
      ui.highlight(element);
    },

    toggleAndScroll() {
      let parent = this.$parent;
      parent.showPreview = false;

      this.togglePreview();
      this.scrollTop();
    }
  }
}
</script>


<style lang="scss" scoped>
@import "../assets/sass/init.scss";

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

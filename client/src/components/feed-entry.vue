<template lang="html">
  <article class="feed-entry">
    <header>
      <a class="toggle" title="Show Preview"
        @click="togglePreview">
        <i v-if="!preview" class="icon-down-open"></i>
        <i v-if="preview" class="icon-up-open"></i>
      </a>
      <div class="title">
        <a :href="entry.link" target="_blank">{{ entry.title }}</a>
        <small>
          {{ sourceName }} | {{entry.date | date}}
        </small>
      </div>
    </header>
    <div v-if="preview" class="preview">
      <div
          class="loading"
          v-if="!loaded">
        <img src="/static/img/loader.gif" alt="loading...">
      </div>

      <div
          class="article-content"
          v-if="loaded"
          v-html="article">
      </div>

      <div class="control-buttons text-center"
          v-if="loaded">
        <a
            class="close-preview"
            @click="toggleAndScroll">
          <i class="icon-cancel"></i> Close Preview
        </a>
      </div>
    </div>
  </article>
</template>


<script>
import parser from 'cleanview';
import Article from '../models/article';
import ui from '../helpers/ui';

export default {
  props: ['entry', 'sourceName'],
  data() {
    return {
      preview: false,
      loaded: false,
      article: ''
    }
  },

  methods: {
    togglePreview() {
      this.preview = !this.preview;

      if (this.preview == false) return;

      let url = this.entry.link;

      Article.get(url).then((article) => {
        let cleanview = parser(article, { url });

        this.article = cleanview;
        this.loaded = true;
      })
    },

    scrollTop() {
      let $element = $(this.$el);
      ui.scrollTo($element);
      ui.highlight($element);
    },

    toggleAndScroll() {
      this.togglePreview();
      this.scrollTop();
    }
  }
}
</script>


<style lang="scss" scoped>
@import "../assets/sass/init.scss";


.feed-entry {
  display: block;
  border-top: $gray-line;

  header {
    display: block;
    position: relative;
  }

  .title {
    padding: .5rem;
    line-height: 1.5rem;
    padding-left: 3rem;

    small {
      display: inline-block;
      font-size: .4rem;
      color: #888;
    }
  }

  .toggle {
    padding: .5rem;
    margin-right: .5rem;
    margin-top: 1px;
    background: $grayish-bg;
    font-size: 1rem;
    color: #666;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
  }

  .preview {
    border-top: $gray-line;
  }

  .loading {
    padding: 3rem;
    text-align: center;
  }

  .article-content {
    padding: 1rem 3rem 2rem 3rem;
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

@include breakpoint(medium down) {
  .feed-entry small {
    display: block;
  }
}

@include breakpoint(small down) {
  .feed-entry .article-content {
    padding: 1rem 1rem 2rem 1rem;
  }
}
</style>

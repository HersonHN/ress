<template lang="html">
  <article class="feed-entry">
    <header>
      <a class="toggle" title="Show Preview"
        @click="togglePreview">
        <i v-if="!preview" class="icon-down-open"></i>
        <i v-if="preview" class="icon-up-open"></i>
      </a>
      <img class="feed-icon" :src="feedIcon()"/>
      <div class="title">
        <a :href="entry.link" target="_blank">{{ entry.title }}</a>
        <small>
          {{ webpage() }} | {{entry.date | date}}
        </small>
      </div>
    </header>
    <div v-if="preview" class="preview">
      <div
          class="loading"
          v-if="!loaded">
        <img src="/img/loader.gif" alt="loading...">
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
import Sources from '../models/sources';
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
    source() {
      let feed = this.entry.feedId;
      let sources = Sources.getCached();
      let source = sources.find(s => s.id == feed);

      return source || {};
    },

    feedIcon() {
      return this.source().icon;
    },

    webpage() {
      let url = this.entry.link;
      let domain = url.split('/')[2];
      let domainTokens = domain.split('.');

      if (domainTokens[0] == 'www') {
        domainTokens = domainTokens.slice(1);
        domain = domainTokens.join('.');
      }
      return domain;
    },
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
    display: flex;
    position: relative;
    align-items: center;
    min-height: 2.5rem;
  }


  .toggle {
    padding: .5rem;
    background: $grayish-bg;
    font-size: 1rem;
    color: #666;
    align-self: stretch;
    display: flex;
    align-items: center;
  }

 .feed-icon {
    float: left;
    height: 1rem;
    margin: .25rem;
  }

  .title {
    padding: .5rem;
    line-height: 1.5rem;

    small {
      margin-left: .5rem;
      display: inline-block;
      font-size: .65rem;
      color: #888;
    }
  }

  .preview {
    border-top: $gray-line;
  }

  .loading {
    padding: 3rem;
    text-align: center;
  }

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

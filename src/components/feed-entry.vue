<template lang="html">
  <article class="feed-entry">
    <header :class="{ 'left-handed': leftHanded }">
      <img class="feed-icon mini" :alt="source().title" :src="feedIcon()" />
     
      <div class="title">
        <a :href="entry.link" target="_blank">{{ entry.title }}</a>
        <small>{{ webpage() }} | {{entry.date | date}}</small>
      </div>
      
      <a class="toggle" title="Show Preview"
        @click="togglePreview">
        <i v-if="!showPreview" class="icon-down-open"></i>
        <i v-if="showPreview" class="icon-up-open"></i>
      </a>
    </header>
    <article-preview ref="preview" :entry="entry" />
  </article>
</template>


<script>
import ArticlePreview from './article-preview';

export default {
  props: ['entry'],
  components: { ArticlePreview },
  data() {
    return {
      leftHanded: false, // @TODO: set an option for this
      showPreview: false,
    }
  },

  methods: {
    source() {
      let feed = this.entry.feedId;
      let sources = window.sources;
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
      this.showPreview = !this.showPreview;

      let preview = this.$refs.preview;
      preview.togglePreview();
    },
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

  header.left-handed .toggle {
    order: -1;
  }

  .title {
    padding: .5rem;
    line-height: 1.5rem;
    flex-grow: 1;

    small {
      margin-left: .5rem;
      display: inline-block;
      font-size: .65rem;
      color: #888;
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

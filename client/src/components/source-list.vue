<template>
  <section class="source-list">
    <router-link :to="{ name: 'all-feeds' }">
      <figure class="home">
        <img src="/static/img/home.svg" width="80px" height="80px">
      </figure>
    </router-link>

    <div v-for="source in sources">
      <router-link :to="{ name: 'single-feed', params: { feedId: source.id } }">
        <figure
            :class="{ selected: source.selected }">
          <img
            width="80px" height="80px"
            :src="source.icon"
            :alt="source.title"
            :title="source.title" />
        </figure>
      </router-link>
    </div>

  </section>
</template>


<script>
import Sources from '@/models/sources';

export default {

  name: 'SourceList',

  data () {
    return { sources: [] }
  },

  created () {
    let feedId = this.$route.params.feedId;
    Sources.get()
      .then(response => this.sources = response)
      .then(this.highlightActive)
  },

  methods: {
    highlightActive () {
      let feedId = this.$route.params.feedId;

      this.sources = this.sources.map(function (source) {
        source.selected = (source.id == feedId);
        return source;
      });
    }
  },

  watch: {
  	'$route': function(value) {
      this.highlightActive();
    }
  }
}
</script>


<style lang="scss" scoped>
  .source-list {
    color: white;

    figure {
      padding: 10px;
      font-weight: bold;
      color: white;
    }

    figure.home img {
      border: transparent 3px solid;
      background: transparent;
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

<template>
  <section class="source-list">

    <router-link :to="{ name: 'config' }">
      <span class="icon-container">
        <i class="icon icon-cog-alt not-that-big"></i>
      </span>
    </router-link>

    <router-link :to="{ name: 'all-feeds' }">
      <span class="icon-container">
        <i class="icon icon-home"></i>
      </span>
    </router-link>

    <span v-for="source in sources" :key="source.id">
      <router-link :to="{ name: 'single-feed', params: { feedId: source.id } }">
        <figure
            :class="{ selected: source.selected }">
          <img
            class="feed-icon"
            width="72" height="72"
            :src="source.icon"
            :alt="source.title"
            :title="source.title" />
        </figure>
      </router-link>
    </span>

  </section>
</template>


<script>
import $ from '../helpers/mini-jquery';

export default {

  name: 'SourceList',

  data () {
    return { sources: [] }
  },

  created () {
    Promise.resolve(window.sources)
      .then(response => this.sources = response)
      .then(this.highlightActive)

    this.$root.$on('sources:saved', data => {
      this.sources = data;
    });
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
    '$route': function() {
      this.highlightActive();

      // @TODO: trigger close on mini-foundation
      // as in: `$('#navigator').foundation('close');`
      let button = $.findOne('[data-open=navigator]');
      if ($.isVisible(button)) {
        $.trigger(button, 'click', 'close');
      }
    }
  }
}
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
        font-size: 50px;
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

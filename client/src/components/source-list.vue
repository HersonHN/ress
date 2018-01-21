<template>
  <section class="source-list">
    <figure
        v-for="source in sources"
        @click="selectSorce(source)"
        :class="{ selected: source.selected }">
      <img
        width="80px" height="80px"
        :src="source.icon"
        :alt="source.title"
        :title="source.title" />
    </figure>
  </section>
</template>


<script>
import Sources from '@/models/sources';

export default {

  name: 'SourceList',

  data () {
    return { sources: [] }
  },

  created() {
    Sources.get()
      .then(response => this.sources = response)
  },

  methods: {

    selectSorce(source) {
      let id = source.id;

      this.sources = this.sources.map(function (source) {
        source.selected = (source.id == id);
        return source;
      });
    }

  }

}
</script>


<style lang="scss" scoped>
  .source-list {
    color: white;

    figure {
      padding: 10px;
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

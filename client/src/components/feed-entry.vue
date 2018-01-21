<template lang="html">
  <article class="feed-entry">
    <a :href="entry.link" target="_blank">{{ entry.title }}</a>
    <small>
      {{ sourceName }} | {{entry.date | date}}
    </small>
  </article>
</template>

<script>
export default {
  props: ['entry', 'sourceName']
}
</script>

<style lang="scss" scoped>
@import "../assets/sass/init.scss";


.feed-entry {
  display: block;
  padding: .5rem;
  border-top: 1px solid #ddd;

  small {
    display: inline-block;
    font-size: .4rem;
    color: #888;
  }
}

@include breakpoint(medium down) {
  .feed-entry small {
    display: block;
  }
}
</style>

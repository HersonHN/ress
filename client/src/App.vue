<template>
    <section id="app" class="off-canvas-wrapper">
      <div class="off-canvas-wrapper-inner" data-off-canvas-wrapper>
        <div class="off-canvas position-left reveal-for-medium" id="navigator" data-off-canvas data-position="left">
          <div class="row column">
            <!-- SIDE COLUMN -->
            <source-list/>
          </div>
        </div>
        <div class="off-canvas-content" data-off-canvas-content>
          <div class="title-bar hide-for-medium">
            <div class="title-bar-left">
              <button class="menu-icon" type="button" data-open="navigator"></button>
              <span class="title-bar-title">RSS Reader</span>
            </div>
          </div>
          <!-- MAIN SECTION -->
          <div class="router-content">
            <router-view :key="$route.fullPath" />
          </div>
        </div>
      </div>
    </section>
</template>


<script>
import SourceList from '@/components/source-list';

export default {
  name: 'App',
  components: { SourceList },

  mounted: function() {
    // init foundation components
    $(document).foundation();
  }
}
</script>


<style lang="scss">
  @import "assets/sass/global.scss";

  .router-content {
    padding: 1rem;
  }
</style>

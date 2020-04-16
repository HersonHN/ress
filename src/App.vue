<template>
    <section id="app" class="off-canvas-wrapper">
      <div class="off-canvas-wrapper-inner" data-off-canvas-wrapper>
        <div id="navigator"
            class="off-canvas position-left reveal-for-medium"
            data-off-canvas data-position="left">

          <!-- SIDE COLUMN -->
          <source-list/>

          <footer class="signature">
            <a href="https://herson.hn" target="_blank">herson.hn</a>
          </footer>
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
import miniFoundation from '@/helpers/mini-foundation';

export default {
  name: 'App',
  components: { SourceList },

  mounted: function() {
    // init foundation components
    miniFoundation.init();
  }
}
</script>


<style lang="scss">
  @import "assets/sass/global.scss";

  #navigator {
    overflow-y: scroll;
  }

  // scrollbar styling (webkit-only so far)
  #navigator::-webkit-scrollbar             { width: 8px; }
  #navigator::-webkit-scrollbar-track       { background-color: $offcanvas-background; }
  #navigator::-webkit-scrollbar-thumb       { background-color: #777; border-radius: 8px;  }
  #navigator:hover::-webkit-scrollbar-thumb { background-color: #888; }


  .router-content {
    max-width: 1024px;
    margin: auto;
  }

  .signature {
    $signature-color: #888;
    display: block;
    margin: 5px 10px;
    color: $signature-color;
    text-decoration: underline;
    font-size: 0.7rem;
    text-align: center;
    padding: 5px 0 20px;
    
    a {
      color: $signature-color;
      transition: color 0.2s linear;
    }

    a:hover { color: lighten($signature-color, 30%) }
  }
</style>

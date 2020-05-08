<template lang="html">
  <div class="loading" :class="type">
    <div class="loader"></div>
  </div>
</template>

<script>
export default {
  name: 'LoadingAnimation',
  props: {
    type: String,
  }
}
</script>

<style lang="scss" scoped>
  .loading {
    padding: 3rem;
    text-align: center;

    .loader { display: inline-block; }

    .loader:after {
      content: " ";
      display: block;
      border-radius: 50%;
      border-width: 5px;
      border-style: solid;
      border-color: #666 transparent #666 transparent;
      animation: loader 1.2s linear infinite;
    }

    .loader,
    .loader:after {
      width: 46px;
      height: 46px;
    }
  }

  .loading.green {
    .loader:after {
      border-color: green transparent green transparent;
    }
  }

  .loading.tiny {
    display: inline-block;
    padding: 0;
    margin-right: .5rem;

    .loader,
    .loader:after {
      width: 12px;
      height: 12px;
    }
    .loader:after {
      border-width: 2px;
    }
  }


  @keyframes loader {
    0%   { transform: rotate(0deg);   }
    100% { transform: rotate(360deg); }
  }
</style>
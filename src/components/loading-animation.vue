<template lang="html">
  <div class="loading">
    <div class="loader"></div>
  </div>
</template>

<style lang="scss" scoped>
  .loading {
    padding: 3rem;
    text-align: center;
  }

  .loader {
    display: inline-block;
    width: 64px;
    height: 64px;
  }

  .loader:after {
    content: " ";
    display: block;
    width: 46px;
    height: 46px;
    margin: 1px;
    border-radius: 50%;
    border: 5px solid #666;
    border-color: #666 transparent #666 transparent;
    animation: loader 1.2s linear infinite;
  }

  @keyframes loader {
    0%   { transform: rotate(0deg);   }
    100% { transform: rotate(360deg); }
  }
</style>

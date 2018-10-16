
let webpackConfig = {
  resolve: {
    alias: {
      moment: 'moment/src/moment'
    }
  }
};

module.exports = {
  configureWebpack: webpackConfig
}
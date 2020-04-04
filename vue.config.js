const path = require('path');

let webpackConfig = {
  // optimization: {
  //   minimize: false
  // }
};

module.exports = {
  configureWebpack: webpackConfig,
  assetsDir: 'assets',
  productionSourceMap: false,
  filenameHashing: true,
  css: {
    loaderOptions: {
      sass: {
        sassOptions: {
          includePaths: [
            path.resolve(__dirname, 'node_modules')
          ]
        }
      }
    }
  }
}

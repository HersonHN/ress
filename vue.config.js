const path = require('path');

let webpackConfig = {
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

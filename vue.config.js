const path = require('path');

let webpackConfig = {
};

module.exports = {
  configureWebpack: webpackConfig,
  css: {
    loaderOptions: {
      sass: {
        // implementation: require('sass'),
        sassOptions: {
          includePaths: [
            path.resolve(__dirname, 'node_modules')
          ]
        }
      }
    }
  }
}
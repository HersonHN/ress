const path = require('path');

let webpackConfig = {
  // resolve: {
  //   alias: {
  //     moment: 'moment/src/moment'
  //   }
  // }
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
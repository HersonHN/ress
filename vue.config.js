const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

let webpackConfig = {
  output: {
    filename: 'assets/vue/[name].vue',
    publicPath: '/',
    chunkFilename: 'assets/vue/[name].vue'
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      test: /\.vue(\?.*)?$/i,
    })]
  }
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

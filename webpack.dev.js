const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    static: [
      {
        directory: path.resolve(__dirname, 'dist'),
      },
      {
        directory: path.resolve(__dirname, 'static'),
        publicPath: '/',
      },
    ],
    open: true,
    port: 3000,
    hot: true,
    watchFiles: ['src/templates/**/*.pug', 'src/blocks/**/*.pug'],
  },
});

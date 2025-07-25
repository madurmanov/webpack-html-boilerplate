const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = (env = {}) => {
  const isMin = !!env.min;

  return merge(common, {
    mode: isMin ? 'production' : 'development',
    devtool: isMin ? false : 'source-map',
    optimization: {
      minimize: isMin,
      minimizer: isMin ? [new TerserPlugin(), new CssMinimizerPlugin()] : [],
    },
  });
};

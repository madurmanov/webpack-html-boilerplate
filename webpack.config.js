const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

function generateHtmlPlugins(dirPath) {
  const files = fs.readdirSync(path.resolve(__dirname, dirPath));
  return files.map(file => {
    const parts = file.split('.');
    const name = parts[0];
    const extension = parts[1];
    return new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: path.resolve(__dirname, `${dirPath}/${name}.${extension}`),
      inject: false,
    });
  });
}

const htmlPlugins = generateHtmlPlugins('./src/html')

module.exports = {
  entry: [
    './src/js/index.js',
    './src/css/index.css',
  ],
  output: {
    filename: './js/bundle.js',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'src/js'),
          path.resolve(__dirname, 'src/blocks'),
        ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: 'env',
          },
        },
      },
      {
        test: /\.css$/,
        include: [
          path.resolve(__dirname, 'src/css'),
          path.resolve(__dirname, 'src/blocks'),
        ],
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                minimize: true,
                url: false,
              },
            },
          ],
        }),
      },
      {
        test: /\.html$/,
        include: path.resolve(__dirname, 'src/blocks'),
        use: ['raw-loader'],
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin({
      filename: './css/bundle.css',
      allChunks: true,
    }),
    new CopyWebpackPlugin([
      {
        from: './src/images',
        to: './images',
      },
      {
        from: './public',
        to: './',
      },
    ]),
  ].concat(htmlPlugins),
};

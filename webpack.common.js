const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const prettier = require('prettier');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const data = require('./src/data');

const generateHtmlPlugins = () => {
  const templatesDir = path.resolve(__dirname, 'src/templates');
  const templateFiles = fs
    .readdirSync(templatesDir)
    .filter((file) => file.endsWith('.ejs'));

  return templateFiles.map((file) => {
    const filePath = path.resolve(templatesDir, file);
    const name = path.parse(file).name;

    return new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: filePath,
      inject: true,
      minify: false,
    });
  });
};

module.exports = {
  entry: path.resolve(__dirname, 'src/js/main.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[contenthash].js',
    assetModuleFilename: 'images/[hash][ext][query]',
    clean: true,
  },
  resolve: {
    extensions: ['.js', '.scss'],
  },
  module: {
    rules: [
      {
        test: /\.ejs$/,
        use: [
          {
            loader: 'html-loader',
            options: { sources: false },
          },
          {
            loader: 'template-ejs-loader',
            options: { data },
          },
        ],
      },
      {
        test: /\.(s[ac]ss|css)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        type: 'asset/resource',
        use: [
          {
            loader: 'image-webpack-loader',
            options: {
              disable: process.env.NODE_ENV !== 'production',
              mozjpeg: { progressive: true, quality: 90 },
              optipng: { enabled: true },
              pngquant: { quality: [0.8, 0.9], speed: 4 },
              gifsicle: { interlaced: false },
              webp: { quality: 90 },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
      chunkFilename: 'css/[id].[contenthash].css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'static'),
          to: path.resolve(__dirname, 'dist'),
        },
      ],
    }),
    ...generateHtmlPlugins(),
  ],
};

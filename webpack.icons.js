const path = require('path');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const RemovePlugin = require('remove-files-webpack-plugin');

const svgSpriteLoader = {
  loader: 'svg-sprite-loader',
  options: {
    extract: true,
    spriteFilename: 'sprite.svg',
    symbolId: 'icon-[name]',
  },
};

const svgoLoaderCommonPlugin = {
  name: 'removeAttrs',
  params: {
    attrs: '(fill|stroke|fill-opacity|stroke-opacity|opacity)',
  },
};

module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, 'src/icons/index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'icons.js',
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        include: path.resolve(__dirname, 'src/icons/color'),
        use: [svgSpriteLoader],
      },
      {
        test: /\.svg$/,
        include: path.resolve(__dirname, 'src/icons/fill'),
        use: [
          svgSpriteLoader,
          {
            loader: 'svgo-loader',
            options: {
              plugins: [
                svgoLoaderCommonPlugin,
                {
                  name: 'addAttributesToSVGElement',
                  params: {
                    attributes: [{ fill: 'currentColor', stroke: 'none' }],
                  },
                },
              ],
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        include: path.resolve(__dirname, 'src/icons/stroke'),
        use: [
          svgSpriteLoader,
          {
            loader: 'svgo-loader',
            options: {
              plugins: [
                svgoLoaderCommonPlugin,
                {
                  name: 'addAttributesToSVGElement',
                  params: {
                    attributes: [{ stroke: 'currentColor', fill: 'none' }],
                  },
                },
              ],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new SpriteLoaderPlugin({
      plainSprite: true,
      spriteAttrs: { style: 'display:none' },
    }),
    new RemovePlugin({
      after: {
        root: path.resolve(__dirname, 'dist'),
        include: ['icons.js'],
      },
    }),
  ],
};

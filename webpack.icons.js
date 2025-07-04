const path = require('path');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const RemovePlugin = require('remove-files-webpack-plugin');

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
        include: path.resolve(__dirname, 'src/icons'),
        use: [
          {
            loader: 'svg-sprite-loader',
            options: {
              extract: true,
              spriteFilename: 'sprite.svg',
              symbolId: 'icon-[name]',
            },
          },
          {
            loader: 'svgo-loader',
            options: {
              plugins: [
                {
                  name: 'removeAttrs',
                  params: {
                    attrs: '(fill|stroke|fill-opacity)',
                  },
                },
                {
                  name: 'addAttributesToSVGElement',
                  params: {
                    attributes: [{ fill: 'currentColor' }],
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

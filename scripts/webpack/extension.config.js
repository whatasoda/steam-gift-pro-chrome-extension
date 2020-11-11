const path = require('path');
const { merge } = require('webpack-merge');
const { default: BaseConfig } = require('@whatasoda/browser-extension-toolkit/webpack-base-config');
require('ts-node').register({ transpileOnly: true });

const { rules, ...base } = BaseConfig(process.env.NODE_ENV, {
  dist: path.resolve(__dirname, '../../dist'),
  entrypoints: path.resolve(__dirname, '../../src/entrypoints'),
});

module.exports = merge(base, {
  resolve: {
    extensions: ['.json', '.js', '.ts', '.tsx'],
  },
  module: {
    rules: [
      ...rules,
      {
        test: /\.(jpg|png|gif|webp|svg)$/i,
        include: /\/assets\//,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'assets',
              name: '[name].[ext]',
            },
          },
        ],
      },
    ],
  },
});

const { merge } = require('webpack-merge');
const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = merge({
  mode: process.env.NODE_ENV,
  entry: path.resolve(__dirname, '../../src/app/index.tsx'),
  output: {
    path: path.resolve(__dirname, '../../dist/app'),
    publicPath: '/app',
  },
  plugins: [new HTMLWebpackPlugin({ template: path.resolve(__dirname, '../../src/app/template.html') })],
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: { transpileOnly: true },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'css-loader',
          },
        ],
      },
    ],
  },
});

const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

require('ts-node').register({ transpileOnly: true });

const mode = process.env.NODE_ENV;

module.exports = {
  devtool: mode !== 'production' ? 'source-map' : 'nosources-source-map',
  entry: {
    content: path.resolve(__dirname, '../../src/entrypoints/content.tsx'),
    background: path.resolve(__dirname, '../../src/entrypoints/background.ts'),
  },
  output: {
    path: path.resolve(__dirname, '../../dist'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.json', '.js', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.tsx?$/i,
        use: [{ loader: 'ts-loader', options: { transpileOnly: true } }],
      },
      {
        test: /\.json\.tsx?$/i,
        use: [{ loader: 'file-loader', options: { name: '[name]' } }, { loader: 'val-loader' }],
      },
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
  optimization: {
    minimize: mode === 'production',
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          sourceMap: false,
          compress: {
            drop_console: true,
          },
          output: {
            comments: false,
          },
        },
      }),
    ],
  },
};

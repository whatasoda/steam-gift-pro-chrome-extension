/* eslint-disable no-console */
import path from 'path';
import webpack, { Configuration } from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import { readdirSync } from 'fs';
import { version } from '../../package.json';

const printLog = (error: Error | null, stat: webpack.Stats) => {
  if (error) {
    console.log(error.message);
    console.log(error.stack);
  } else {
    process.stdout.write(
      stat.toString({
        colors: true,
      }),
    );
  }
};

const getEntries = (dir: string) => {
  return readdirSync(dir)
    .filter((file) => /^[^_].+\.tsx?$/.test(file))
    .reduce<Record<string, string>>((acc, file) => {
      const key = path.parse(file).name;
      acc[key] = path.join(dir, file);
      return acc;
    }, {});
};

export const createCompiler = (mode: Configuration['mode']) => {
  const compiler = webpack({
    mode,
    devtool: mode !== 'production' ? 'source-map' : 'nosources-source-map',
    entry: getEntries(path.resolve(__dirname, '../../src/entrypoints')),
    output: {
      path: path.resolve(__dirname, '../../dist'),
      filename: '[name].js',
    },
    resolve: {
      extensions: ['.json', '.js', '.ts', '.tsx'],
    },
    optimization: {
      minimize: mode === 'production',
      minimizer: [
        new TerserPlugin({
          sourceMap: true,
          terserOptions: {
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
    plugins: [
      new webpack.DefinePlugin({
        'process.env': JSON.stringify({
          NODE_ENV: mode !== 'production' ? 'development' : 'production',
          VERSION: version,
        }),
      }),
    ],
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.tsx?$/i,
          use: [
            {
              loader: 'ts-loader',
              options: { transpileOnly: true },
            },
          ],
        },
        {
          test: /\.json\.tsx?$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name]',
              },
            },
            'val-loader',
          ],
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
  });

  return {
    compiler,
    watch: () => compiler.watch({}, printLog),
    run: () => compiler.run(printLog),
  };
};

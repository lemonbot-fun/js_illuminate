const path = require('path');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');

const config = require('../config');
const { srcDir, distDir } = require('../utils/utils');

module.exports = {
  mode: 'production',
  entry: {
    app: [path.resolve(srcDir, 'components/index.scss')],
  },
  output: {
    path: path.resolve(distDir, 'components'),
    filename: '_.js',
  },
  resolve: {
    extensions: ['.css', '.scss'],
    alias: config.alias,
  },
  externals: {},
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false,
          },
        },
      }),
    ],
  },
  performance: {
    hints: false,
  },
  stats: {
    children: false,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 4096,
              // use explicit fallback to avoid regression in url-loader>=1.1.0
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'fonts/[name].[ext]',
                }
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new ProgressBarPlugin(),
    new MiniCssExtractPlugin({
      filename: 'index.css',
      allChunks: true,
    }),
    new FixStyleOnlyEntriesPlugin(),
  ],
};

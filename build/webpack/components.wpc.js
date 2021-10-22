const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const TerserPlugin = require('terser-webpack-plugin');

const { resolveModule, loadModule } = require('../utils/modules');
const config = require('../config');

const { srcDir, distDir } = require('../utils/utils');

const extensions = ['.js', '.ts', '.tsx', '.vue', '.json'];

const cwd = process.cwd();

module.exports = {
  mode: 'production',
  optimization: {
    minimize: false
  },
  entry: {
    app: [path.resolve(srcDir, 'components/index.ts')],
  },
  output: {
    path: path.resolve(distDir, 'components'),
    publicPath: '/components/',
    filename: 'index.js',
    chunkFilename: '[id].js',
    libraryTarget: 'commonjs2',
    library: 'components',
    globalObject: 'typeof self !== \'undefined\' ? self : this',
  },
  resolve: {
    alias: config.alias,
    extensions,
  },
  externals: {
    vue: config.vue,
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
        test: /\.(jsx?|babel|es6)$/,
        include: process.cwd(),
        exclude: config.jsexclude,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[local]_[hash:base64:8]',
            },
          }
        ]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            ts: 'ts-loader',
            tsx: 'babel-loader!ts-loader',
          },
          compilerOptions: {
            // preserveWhitespace: false,
          },
        }
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              appendTsSuffixTo: ['\\.vue$'],
              happyPackMode: false,
            },
          },
        ],
      },
      {
        test: /\.tsx$/,
        use: [
          { loader: 'babel-loader' },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              appendTsxSuffixTo: ['\\.vue$'],
              happyPackMode: false,
            },
          },
        ],
      },
      {
        enforce: 'pre',
        exclude: [/node_modules/],
        test: /\.(vue|(j|t)sx?)$/,
        use: [{
          loader: 'eslint-loader',
          options: {
            extensions,
            emitWarning: true,
            // only emit errors in production mode.
            emitError: true,
            eslintPath: path.dirname(
              resolveModule('eslint/package.json', cwd)
              || resolveModule('eslint/package.json', __dirname)
            ),
            formatter: loadModule('eslint/lib/formatters/codeframe', cwd, true)
          }
        }],
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
  ],
};

/**
 * Build config for electron renderer process
 */

import path from 'path'
import { EnvironmentPlugin, ExternalsPlugin } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CspHtmlWebpackPlugin from 'csp-html-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import CleanWebpackPlugin from 'clean-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import merge from 'webpack-merge'
import baseConfig, { rootDir } from './webpack.config.base'
import { dependencies as externals } from '../../app/package.json'

export default merge.smart(baseConfig, {
  devtool: 'source-map',

  target: 'web',

  mode: 'production',

  externals: new ExternalsPlugin('commonjs', [...Object.keys(externals || {})]),

  entry: {
    renderer: path.join(rootDir, 'app', 'index'),
  },

  output: {
    path: path.join(rootDir, 'app', 'dist'),
    filename: '[name].prod.js',
  },

  stats: {
    children: false,
  },

  module: {
    rules: [
      // Common Image Formats
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/,
        use: 'url-loader',
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin([path.resolve('app', 'dist')], {
      root: path.resolve('..', '..'),
    }),

    new EnvironmentPlugin({
      NODE_ENV: 'production',
    }),

    new HtmlWebpackPlugin({
      template: path.join('app', 'app.html'),
    }),

    new CopyWebpackPlugin([
      path.join('app', 'empty.html'),
      { from: path.join('app/lib/zap/about', 'preload.js'), to: 'about_preload.prod.js' },
    ]),

    new CspHtmlWebpackPlugin({
      'default-src': "'self'",
      'object-src': "'none'",
      'connect-src': [
        "'self'",
        'https://api.coinbase.com',
        'https://bitcoinfees.earn.com',
        'https://zap.jackmallers.com',
      ],
      'img-src': ['http://www.zap.jackmallers.com'],
      'script-src': ["'self'"],
      'font-src': ["'self'", 'data:', 'https://s3.amazonaws.com', 'https://fonts.gstatic.com'],
      'style-src': ["'self'", 'blob:', 'https://s3.amazonaws.com', "'unsafe-inline'"],
    }),

    new BundleAnalyzerPlugin({
      analyzerMode: process.env.OPEN_ANALYZER === 'true' ? 'server' : 'disabled',
      openAnalyzer: process.env.OPEN_ANALYZER === 'true',
    }),
  ],

  node: {
    __dirname: false,
    __filename: false,
    fs: 'empty',
    module: 'empty',
  },
})

/**
 * Build config for electron renderer process
 */

import path from 'path'
import { ExternalsPlugin } from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
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
    renderer: path.join(rootDir, 'app', 'index')
  },

  output: {
    path: path.join(rootDir, 'app', 'dist'),
    filename: '[name].prod.js'
  },

  stats: {
    children: false
  },

  module: {
    rules: [
      // Add SASS support  - compile all .global.scss files and pipe it to renderer.css
      {
        test: /\.global\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              includePaths: ['app']
            }
          }
        ]
      },
      // Add SASS support  - compile all other .scss files and pipe it to renderer.css
      {
        test: /^((?!\.global).)*\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]__[hash:base64:5]'
            }
          },
          {
            loader: 'sass-loader',
            options: {
              includePaths: ['app']
            }
          }
        ]
      },
      // SVG Font
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'image/svg+xml'
          }
        }
      },
      // Common Image Formats
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/,
        use: 'url-loader'
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin([path.resolve('app', 'dist')], {
      root: path.resolve('..', '..')
    }),

    new MiniCssExtractPlugin(),

    new HtmlWebpackPlugin({
      template: path.join('app', 'app.html')
    }),

    new CopyWebpackPlugin([
      path.join('app', 'empty.html'),
      { from: path.join('app', 'preload.js'), to: 'preload.prod.js' }
    ]),

    new CspHtmlWebpackPlugin({
      'default-src': "'self'",
      'object-src': "'none'",
      'connect-src': [
        "'self'",
        'https://api.coinbase.com',
        'https://bitcoinfees.earn.com',
        'https://zap.jackmallers.com'
      ],
      'script-src': ["'self'"],
      'font-src': ["'self'", 'data:', 'https://s3.amazonaws.com', 'https://fonts.gstatic.com'],
      'style-src': ["'self'", 'blob:', 'https://s3.amazonaws.com', "'unsafe-inline'"]
    }),

    new BundleAnalyzerPlugin({
      analyzerMode: process.env.OPEN_ANALYZER === 'true' ? 'server' : 'disabled',
      openAnalyzer: process.env.OPEN_ANALYZER === 'true'
    })
  ]
})

/**
 * Builds the DLL for development electron renderer process
 */

import webpack from 'webpack'
import path from 'path'
import merge from 'webpack-merge'
import baseConfig, { rootDir } from './webpack.config.base'
import { dependencies } from '../../package.json'

export default merge.smart(baseConfig, {
  context: process.cwd(),

  devtool: 'eval',

  target: 'web',

  mode: 'development',

  externals: [
    '@grpc/grpc-js',
    '@grpc/proto-loader',
    'electron',
    'electron-is-dev',
    'get-port',
    'redux-electron-ipc',
    'rimraf',
    'source-map-support'
  ],

  /**
   * @HACK: Copy and pasted from renderer dev config. Consider merging these
   *        rules into the base config. May cause breaking changes.
   */
  module: {
    rules: [
      // Add SASS support  - compile all .global.scss files and pipe it to main.css
      {
        test: /\.global\.scss$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
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
      // Add SASS support  - compile all other .scss files and pipe it to main.css
      {
        test: /^((?!\.global).)*\.scss$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: true,
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

  resolve: {
    modules: ['app']
  },

  entry: {
    renderer: Object.keys(dependencies)
  },

  output: {
    path: path.join(rootDir, 'dll'),
    library: 'renderer',
    filename: '[name].dev.dll.js',
    libraryTarget: 'var'
  },

  plugins: [
    new webpack.DllPlugin({
      path: path.join('dll', '[name].json'),
      name: '[name]'
    }),

    new webpack.LoaderOptionsPlugin({
      debug: true,
      options: {
        context: path.join(rootDir, 'app'),
        output: {
          path: path.join(rootDir, 'dll')
        }
      }
    })
  ]
})

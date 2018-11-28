/**
 * Base webpack config used across other specific configs
 */

import path from 'path'
import { IgnorePlugin } from 'webpack'

export const rootDir = path.join(__dirname, '..', '..')

export default {
  context: rootDir,

  module: {
    rules: [
      // JSX
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        }
      },
      // WOFF Font
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/font-woff'
          }
        }
      },
      // WOFF2 Font
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/font-woff'
          }
        }
      },
      // TTF Font
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/octet-stream'
          }
        }
      }
    ]
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    modules: [path.resolve(rootDir, 'app'), 'node_modules', 'app/node_modules']
  },

  plugins: [new IgnorePlugin(/^\.\/locale$/, /moment$/)],

  optimization: {
    namedModules: true
  }
}

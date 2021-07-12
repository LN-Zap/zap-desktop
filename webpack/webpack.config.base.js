/**
 * Base webpack config used across other specific configs
 */

import fs from 'fs'
import path from 'path'

import config from 'config'
import { IgnorePlugin } from 'webpack'

export const rootDir = path.join(__dirname, '..')

// This will take the config based on the current NODE_ENV and save it to 'dist/config.json'
// The webpack alias below will then build that file into the client build.
fs.mkdirSync(path.resolve(rootDir, 'dist'), { recursive: true })
fs.writeFileSync(path.resolve(rootDir, 'dist/config.json'), JSON.stringify(config))

export default {
  context: rootDir,

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    modules: [path.resolve(rootDir, 'renderer'), 'node_modules'],
    // Define an alias that makes the global config available.
    alias: {
      config: path.resolve(rootDir, 'dist/config.json'),
    },
  },

  plugins: [new IgnorePlugin(/^\.\/locale$/, /moment$/)],

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: [/node_modules/],
        use: {
          loader: 'babel-loader',
          options: {
            rootMode: 'upward',
            cacheDirectory: true,
          },
        },
      },
      // WOFF Font
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'file-loader',
        },
      },
      // WOFF2 Font
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'file-loader',
        },
      },
      // TTF Font
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/octet-stream',
          },
        },
      },
      // Common Image Formats
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/,
        use: 'url-loader',
      },
    ],
  },

  optimization: {
    namedModules: true,
  },
}

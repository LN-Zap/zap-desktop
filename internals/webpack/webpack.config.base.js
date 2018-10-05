/**
 * Base webpack config used across other specific configs
 */

import path from 'path'
import { IgnorePlugin } from 'webpack'
import { dependencies as externals } from '../../app/package.json'

export const rootDir = path.join(__dirname, '..', '..')

export default {
  externals: Object.keys(externals || {}),

  context: rootDir,

  output: {
    // https://github.com/webpack/webpack/issues/1114
    libraryTarget: 'commonjs2'
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        }
      }
    ]
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: [path.join(rootDir, 'app'), path.join(rootDir, 'app/node_modules'), 'node_modules']
  },

  plugins: [new IgnorePlugin(/^\.\/locale$/, /moment$/)],

  optimization: {
    namedModules: true
  }
}

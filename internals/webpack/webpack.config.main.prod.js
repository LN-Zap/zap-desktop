/**
 * Webpack config for production electron main process
 */

import path from 'path'
import webpack from 'webpack'
import merge from 'webpack-merge'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import baseConfig, { rootDir } from './webpack.config.base'

export default merge.smart(baseConfig, {
  devtool: 'source-map',

  target: 'electron-main',

  mode: 'production',

  entry: path.join(rootDir, 'app', 'main.dev'),

  // 'main.js' in root
  output: {
    path: path.join(rootDir, 'app'),
    filename: 'main.prod.js'
  },

  plugins: [
    /**
     * Babli is an ES6+ aware minifier based on the Babel toolchain (beta)
     */
    new BundleAnalyzerPlugin({
      analyzerMode: process.env.OPEN_ANALYZER === 'true' ? 'server' : 'disabled',
      openAnalyzer: process.env.OPEN_ANALYZER === 'true'
    }),

    /**
     * Create global constants which can be configured at compile time.
     *
     * Useful for allowing different behaviour between development builds and
     * release builds
     */
    new webpack.EnvironmentPlugin({
      DEBUG_PROD: false
    })
  ],

  /**
   * Disables webpack processing of __dirname and __filename.
   * If you run the bundle in node.js it falls back to these values of node.js.
   * https://github.com/webpack/webpack/issues/2010
   */
  node: {
    __dirname: false,
    __filename: false
  }
})

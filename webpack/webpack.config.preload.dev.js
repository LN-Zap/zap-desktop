/**
 * Webpack config for development electron preload process
 */

import path from 'path'
import merge from 'webpack-merge'
import { EnvironmentPlugin } from 'webpack'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import baseConfig, { rootDir } from './webpack.config.base'

export default merge.smart(baseConfig, {
  devtool: 'source-map',

  target: 'electron-renderer',

  mode: 'development',

  entry: {
    preload: path.join(rootDir, 'app', 'preload'),
  },

  output: {
    path: path.join(rootDir, 'app', 'dist'),
    filename: '[name].dev.js',
  },

  plugins: [
    new EnvironmentPlugin({
      NODE_ENV: 'development',
    }),

    new BundleAnalyzerPlugin({
      analyzerMode: process.env.OPEN_ANALYZER === 'true' ? 'server' : 'disabled',
      openAnalyzer: process.env.OPEN_ANALYZER === 'true',
    }),
  ],

  /**
   * Disables webpack processing of __dirname and __filename.
   * If you run the bundle in node.js it falls back to these values of node.js.
   * https://github.com/webpack/webpack/issues/2010
   */
  node: {
    __dirname: false,
    __filename: false,
  },
})

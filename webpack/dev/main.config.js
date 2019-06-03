/**
 * Webpack config for production electron main process
 */

import path from 'path'
import merge from 'webpack-merge'
import { EnvironmentPlugin } from 'webpack'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import baseConfig, { rootDir } from '../webpack.config.base'
import { publicPath } from './common/devserver'

const config = merge.smart(baseConfig, {
  name: 'main',
  target: 'electron-main',
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  entry: {
    main: path.join(rootDir, 'electron', 'main'),
  },
  output: {
    filename: '[name].js',
    publicPath,
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
  node: {
    __dirname: false,
    __filename: false,
  },
})

export default config

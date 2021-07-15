import path from 'path'

import merge from 'webpack-merge'

import baseConfig, { rootDir } from '../webpack.config.base'
import { publicPath } from './common/devserver'
import plugins from './common/plugins'

const config = merge.smart(baseConfig, {
  name: 'preload',
  target: 'electron-preload',
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  entry: {
    preload: path.join(rootDir, 'electron', 'preload'),
  },
  output: {
    filename: '[name].js',
    publicPath,
  },
  plugins,
  node: {
    __dirname: false,
    __filename: false,
  },
})

export default config

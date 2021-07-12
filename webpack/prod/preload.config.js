import path from 'path'

import merge from 'webpack-merge'

import baseConfig, { rootDir } from '../webpack.config.base'
import plugins from './common/plugins'

const config = merge.smart(baseConfig, {
  name: 'preload',
  target: 'electron-preload',
  mode: 'production',
  devtool: 'source-map',
  entry: {
    preload: path.join(rootDir, 'electron', 'preload'),
  },
  output: {
    filename: '[name].js',
    path: path.join(rootDir, 'dist'),
  },
  plugins,
  node: {
    __dirname: false,
    __filename: false,
  },
})

export default config

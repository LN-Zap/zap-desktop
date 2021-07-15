import path from 'path'

import merge from 'webpack-merge'

import baseConfig, { rootDir } from '../webpack.config.base'
import { publicPath } from './common/devserver'
import plugins from './common/plugins'

const config = merge.smart(baseConfig, {
  name: 'workers',
  target: 'electron-renderer',
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  entry: {
    grpc: path.join(rootDir, 'renderer/workers', 'grpc.worker'),
    neutrino: path.join(rootDir, 'renderer/workers', 'neutrino.worker'),
  },
  output: {
    filename: '[name].worker.js',
    publicPath,
    globalObject: 'this',
  },
  resolve: {
    alias: {
      config: path.resolve(rootDir, 'dist/config.json'),
    },
  },
  stats: {
    children: false,
  },
  plugins,
  node: {
    __dirname: false,
    __filename: false,
  },
  optimization: {
    noEmitOnErrors: true,
  },
})

export default config

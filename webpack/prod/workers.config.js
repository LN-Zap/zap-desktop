import path from 'path'

import merge from 'webpack-merge'

import baseConfig, { rootDir } from '../webpack.config.base'
import plugins from './common/plugins'

const config = merge.smart(baseConfig, {
  name: 'workers',
  target: 'electron-renderer',
  mode: 'production',
  devtool: 'source-map',
  entry: {
    grpc: path.join(rootDir, 'renderer/workers', 'grpc.worker'),
    neutrino: path.join(rootDir, 'renderer/workers', 'neutrino.worker'),
  },
  output: {
    filename: '[name].worker.js',
    path: path.join(rootDir, 'dist'),
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

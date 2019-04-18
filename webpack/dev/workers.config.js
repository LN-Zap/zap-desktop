import path from 'path'
import merge from 'webpack-merge'
import baseConfig, { rootDir } from '../webpack.config.base'
import devServer, { publicPath } from './common/devserver'
import plugins from './common/plugins'

const config = merge.smart(baseConfig, {
  name: 'workers',
  target: 'electron-renderer',
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    lightning: path.join(rootDir, 'renderer/workers', 'lightning.worker'),
    walletUnlocker: path.join(rootDir, 'renderer/workers', 'walletUnlocker.worker'),
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
  devServer,
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

/**
 * Builds the DLL for development electron renderer process.
 */

import path from 'path'

import webpack from 'webpack'
import merge from 'webpack-merge'

import { dependencies } from '../package.json'
import baseConfig, { rootDir } from './webpack.config.base'

export default merge.smart(baseConfig, {
  context: process.cwd(),
  devtool: 'eval',
  target: 'web',
  mode: 'development',
  externals: [
    '@grpc/grpc-js',
    '@grpc/proto-loader',
    'config',
    'electron',
    'electron-is-dev',
    'get-port',
    'lndconnect',
    'lnd-grpc',
    'react-hot-loader',
    'redux-electron-ipc',
    'rimraf',
    'source-map-support',
    'googleapis',
    'keytar',
  ],
  entry: {
    renderer: Object.keys(dependencies),
  },
  output: {
    path: path.join(rootDir, 'dll'),
    library: 'renderer',
    filename: '[name].dll.js',
    libraryTarget: 'var',
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join('dll', '[name].json'),
      name: '[name]',
    }),
  ],
})

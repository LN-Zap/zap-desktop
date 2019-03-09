/**
 * Builds the DLL for development electron renderer process
 */

import webpack from 'webpack'
import path from 'path'
import merge from 'webpack-merge'
import baseConfig, { rootDir } from './webpack.config.base'
import { dependencies } from '../../package.json'

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
    'redux-electron-ipc',
    'rimraf',
    'source-map-support',
  ],

  /**
   * @HACK: Copy and pasted from renderer dev config. Consider merging these
   *        rules into the base config. May cause breaking changes.
   */
  module: {
    rules: [
      // Common Image Formats
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/,
        use: 'url-loader',
      },
    ],
  },

  resolve: {
    modules: ['app'],
  },

  entry: {
    renderer: Object.keys(dependencies),
  },

  output: {
    path: path.join(rootDir, 'dll'),
    library: 'renderer',
    filename: '[name].dev.dll.js',
    libraryTarget: 'var',
  },

  plugins: [
    new webpack.DllPlugin({
      path: path.join('dll', '[name].json'),
      name: '[name]',
    }),

    new webpack.LoaderOptionsPlugin({
      debug: true,
      options: {
        context: path.join(rootDir, 'app'),
        output: {
          path: path.join(rootDir, 'dll'),
        },
      },
    }),
  ],
})

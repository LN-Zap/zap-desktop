/* eslint global-require: 0, import/no-dynamic-require: 0 */
import path from 'path'

import AddAssetHtmlPlugin from 'add-asset-html-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import CspHtmlWebpackPlugin from 'csp-html-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import webpack from 'webpack'
import merge from 'webpack-merge'

import baseConfig, { rootDir } from '../webpack.config.base'
import devServer, { publicPath } from './common/devserver'
import plugins from './common/plugins'

const dll = path.resolve(rootDir, 'dll')
const manifest = path.resolve(dll, 'renderer.json')

const config = merge.smart(baseConfig, {
  name: 'renderer',
  target: 'web',
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  entry: {
    renderer: path.join(rootDir, 'renderer', 'index'),
  },
  output: {
    filename: '[name].js',
    publicPath,
  },
  stats: {
    children: false,
  },
  devServer,
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
  plugins: [
    ...plugins,
    new HtmlWebpackPlugin({
      inject: true,
      template: path.join('renderer', 'app.html'),
    }),
    new CspHtmlWebpackPlugin({
      'default-src': "'self'",
      'object-src': "'none'",
      'connect-src': [
        "'self'",
        'http://localhost:*',
        'ws://localhost:*',
        'https://api.coinbase.com/',
        'https://api.kraken.com/',
        'https://www.bitstamp.net/',
        'https://api.bitfinex.com/',
        'https://testnet-api.smartbit.com.au',
        'https://api.smartbit.com.au',
        'https://api.blockcypher.com',
        'https://bitcoinfees.earn.com',
        'https://nodes.lightning.computer',
        'https://resources.zaphq.io',
      ],
      'img-src': ['http://resources.zaphq.io', 'data:'],
      'script-src': ["'self'", 'http://localhost:*', "'unsafe-eval'"],
      'font-src': ["'self'", 'data:', 'http://localhost:*', 'https://s3.amazonaws.com'],
      'style-src': ["'self'", 'blob:', 'https://s3.amazonaws.com', "'unsafe-inline'"],
    }),
    new webpack.DllReferencePlugin({
      context: process.cwd(),
      manifest: require(manifest),
      sourceType: 'var',
    }),
    new AddAssetHtmlPlugin({
      filepath: path.join('dll', 'renderer.dll.js'),
      includeSourcemap: true,
    }),
    new CopyWebpackPlugin([
      path.join('renderer', 'empty.html'),
      { from: path.join('electron', 'about'), to: 'about' },
    ]),
  ],
  node: {
    fs: 'empty',
    module: 'empty',
  },
  optimization: {
    noEmitOnErrors: true,
  },
})

export default config

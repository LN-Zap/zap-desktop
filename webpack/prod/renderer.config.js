import path from 'path'

import CopyWebpackPlugin from 'copy-webpack-plugin'
import CspHtmlWebpackPlugin from 'csp-html-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import merge from 'webpack-merge'

import baseConfig, { rootDir } from '../webpack.config.base'
import plugins from './common/plugins'

const config = merge.smart(baseConfig, {
  name: 'renderer',
  target: 'web',
  mode: 'production',
  devtool: 'source-map',
  entry: {
    renderer: path.join(rootDir, 'renderer', 'index'),
  },
  output: {
    filename: '[name].js',
    path: path.join(rootDir, 'dist'),
  },
  stats: {
    children: false,
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
        'https://api.coinbase.com/',
        'https://api.kraken.com/',
        'https://bitstamp.net/',
        'https://api.bitfinex.com/',
        'https://testnet-api.smartbit.com.au',
        'https://api.smartbit.com.au',
        'https://api.blockcypher.com',
        'https://bitcoinfees.earn.com',
        'https://nodes.lightning.computer',
        'https://resources.zaphq.io',
      ],
      'img-src': ['http://resources.zaphq.io', 'data:'],
      'script-src': ["'self'", "'unsafe-eval'"],
      'font-src': ["'self'", 'data:', 'https://s3.amazonaws.com'],
      'style-src': ["'self'", 'blob:', 'https://s3.amazonaws.com', "'unsafe-inline'"],
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

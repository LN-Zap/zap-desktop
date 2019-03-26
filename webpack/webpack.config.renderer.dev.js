/* eslint global-require: 0, import/no-dynamic-require: 0 */

/**
 * Build config for development electron renderer process that uses
 * Hot-Module-Replacement
 *
 * https://webpack.js.org/concepts/hot-module-replacement/
 */

import path from 'path'
import fs from 'fs'
import webpack from 'webpack'
import merge from 'webpack-merge'
import { spawn, execSync } from 'child_process'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import AddAssetHtmlPlugin from 'add-asset-html-webpack-plugin'
import CspHtmlWebpackPlugin from 'csp-html-webpack-plugin'
import { mainLog } from '@zap/utils/log'
import baseConfig, { rootDir } from './webpack.config.base'

const port = process.env.PORT || 1212
const publicPath = `http://localhost:${port}/dist`
const dll = path.resolve(rootDir, 'dll')
const manifest = path.resolve(dll, 'renderer.json')

/**
 * Warn if the DLL is not built
 */
if (!(fs.existsSync(dll) && fs.existsSync(manifest))) {
  mainLog.info(
    'The DLL files are missing. Sit back while we build them for you with "npm run build-dll"'
  )
  execSync('npm run build-dll')
}

export default merge.smart(baseConfig, {
  devtool: 'inline-source-map',

  target: 'web',

  mode: 'development',

  entry: path.join(rootDir, 'app', 'index'),

  output: {
    publicPath: `http://localhost:${port}/dist/`,
  },

  stats: {
    children: false,
  },

  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },
      // Common Image Formats
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/,
        use: 'url-loader',
      },
    ],
  },

  plugins: [
    new webpack.DllReferencePlugin({
      context: process.cwd(),
      manifest: require(manifest),
      sourceType: 'var',
    }),

    new webpack.LoaderOptionsPlugin({
      debug: true,
    }),

    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
    }),

    new HtmlWebpackPlugin({
      template: path.join('app', 'app.html'),
    }),

    new AddAssetHtmlPlugin({
      filepath: path.join('dll', 'renderer.dev.dll.js'),
      includeSourcemap: false,
    }),

    new CspHtmlWebpackPlugin({
      'default-src': "'self'",
      'object-src': "'none'",
      'connect-src': [
        "'self'",
        'http://localhost:*',
        'ws://localhost:*',
        'https://api.coinbase.com/',
        'https://bitcoinfees.earn.com',
        'https://zap.jackmallers.com',
      ],
      'img-src': ['http://www.zap.jackmallers.com'],
      'script-src': ["'self'", 'http://localhost:*', "'unsafe-eval'"],
      'font-src': [
        "'self'",
        'data:',
        'http://localhost:*',
        'https://s3.amazonaws.com',
        'https://fonts.gstatic.com',
      ],
      'style-src': ["'self'", 'blob:', 'https://s3.amazonaws.com', "'unsafe-inline'"],
    }),
  ],

  node: {
    __dirname: false,
    __filename: false,
    fs: 'empty',
    module: 'empty',
  },

  devServer: {
    port,
    hot: true,
    publicPath,
    headers: { 'Access-Control-Allow-Origin': '*' },
    watchOptions: {
      aggregateTimeout: 300,
      ignored: /node_modules/,
      poll: 100,
    },
    proxy: {
      '/proxy/zap.jackmallers.com': {
        target: 'https://zap.jackmallers.com',
        pathRewrite: { '^/proxy/zap.jackmallers.com': '' },
        changeOrigin: true,
      },
      '/proxy/api.coinbase.com': {
        target: 'https://api.coinbase.com',
        pathRewrite: { '^/proxy/api.coinbase.com': '' },
        changeOrigin: true,
      },
    },
    historyApiFallback: true,
    // Start the main process as soon as the server is listening.
    after: () => {
      if (process.env.HOT) {
        spawn('npm', ['run', 'start-main-dev'], {
          shell: true,
          env: process.env,
          stdio: 'inherit',
        })
          .on('close', code => process.exit(code))
          .on('error', spawnError => mainLog.error(spawnError))
      }
    },
  },

  optimization: {
    noEmitOnErrors: true,
  },
})

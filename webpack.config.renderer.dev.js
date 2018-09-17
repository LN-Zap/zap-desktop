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
import convert from 'koa-connect'
import history from 'connect-history-api-fallback'
import proxy from 'http-proxy-middleware'
import { spawn, execSync } from 'child_process'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import AddAssetHtmlPlugin from 'add-asset-html-webpack-plugin'
import CspHtmlWebpackPlugin from 'csp-html-webpack-plugin'
import baseConfig from './webpack.config.base'
import { mainLog } from './app/lib/utils/log'

const port = process.env.PORT || 1212
const publicPath = `http://localhost:${port}/dist`
const dll = path.resolve(process.cwd(), 'dll')
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

  target: 'electron-renderer',

  mode: 'development',

  entry: ['webpack/hot/only-dev-server', path.join(__dirname, 'app/index.js')],

  output: {
    publicPath: `http://localhost:${port}/dist/`
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
            plugins: [
              // Here, we include babel plugins that are only required for the
              // renderer process. The 'transform-*' plugins must be included
              // before react-hot-loader/babel
              'transform-class-properties',
              'transform-es2015-classes',
              'react-hot-loader/babel'
            ]
          }
        }
      },
      {
        test: /\.global\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /^((?!\.global).)*\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]__[hash:base64:5]'
            }
          }
        ]
      },
      // Add SASS support  - compile all .global.scss files and pipe it to style.css
      {
        test: /\.global\.scss$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              includePaths: [path.join(__dirname, 'app')]
            }
          }
        ]
      },
      // Add SASS support  - compile all other .scss files and pipe it to style.css
      {
        test: /^((?!\.global).)*\.scss$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]__[hash:base64:5]'
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              includePaths: [path.join(__dirname, 'app')]
            }
          }
        ]
      },
      // WOFF Font
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/font-woff'
          }
        }
      },
      // WOFF2 Font
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/font-woff'
          }
        }
      },
      // TTF Font
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/octet-stream'
          }
        }
      },
      // EOT Font
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: 'file-loader'
      },
      // SVG Font
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'image/svg+xml'
          }
        }
      },
      // Common Image Formats
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/,
        use: 'url-loader'
      }
    ]
  },

  plugins: [
    new webpack.DllReferencePlugin({
      context: process.cwd(),
      manifest: require(manifest),
      sourceType: 'var'
    }),

    new webpack.LoaderOptionsPlugin({
      debug: true
    }),

    new ExtractTextPlugin({
      filename: '[name].css'
    }),

    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'app', 'app.html')
    }),

    new AddAssetHtmlPlugin({
      filepath: path.join(__dirname, 'dll', 'renderer.dev.dll.js'),
      includeSourcemap: false
    }),

    new CspHtmlWebpackPlugin({
      'default-src': "'self'",
      'object-src': "'none'",
      'connect-src': [
        "'self'",
        'http://localhost:*',
        'ws://localhost:*',
        'https://blockchain.info',
        'https://zap.jackmallers.com'
      ],
      'script-src': ["'self'", 'http://localhost:*', "'unsafe-eval'"],
      'font-src': [
        "'self'",
        'data:',
        'http://localhost:*',
        'https://fonts.googleapis.com',
        'https://s3.amazonaws.com',
        'https://fonts.gstatic.com'
      ],
      'style-src': [
        "'self'",
        'blob:',
        'https://fonts.googleapis.com',
        'https://s3.amazonaws.com',
        'https://fonts.gstatic.com',
        "'unsafe-inline'"
      ]
    })
  ],

  node: {
    __dirname: false,
    __filename: false
  },

  serve: {
    port,
    content: path.join(__dirname, 'dist'),
    hotClient: {
      validTargets: ['electron-renderer']
    },
    devMiddleware: {
      publicPath,
      stats: 'errors-only',
      headers: { 'Access-Control-Allow-Origin': '*' },
      watchOptions: {
        aggregateTimeout: 300,
        ignored: /node_modules/,
        poll: 100
      }
    },
    // Add middleware to proxy requests to selected remote sites.
    add: app => {
      app.use(
        convert(
          proxy('/proxy/zap.jackmallers.com', {
            target: 'https://zap.jackmallers.com',
            pathRewrite: { '^/proxy/zap.jackmallers.com': '' },
            changeOrigin: true
          })
        )
      )
      app.use(
        convert(
          proxy('/proxy/blockchain.info', {
            target: 'https://blockchain.info/ticker',
            pathRewrite: { '^/proxy/blockchain.info': '' },
            changeOrigin: true
          })
        )
      )
      app.use(convert(history()))
    },
    // Start the main process as soon as the server is listening.
    on: {
      listening: () => {
        if (process.env.START_HOT) {
          spawn('npm', ['run', 'start-main-dev'], {
            shell: true,
            env: process.env,
            stdio: 'inherit'
          })
            .on('close', code => process.exit(code))
            .on('error', spawnError => mainLog.error(spawnError))
        }
      }
    }
  },

  optimization: {
    noEmitOnErrors: true
  }
})

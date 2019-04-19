import { spawn } from 'child_process'
import { mainLog } from '@zap/utils/log'

export const port = process.env.PORT || 1212
export const publicPath = `http://localhost:${port}/dist/`

const devServer = {
  port,
  hot: true,
  publicPath,
  headers: { 'Access-Control-Allow-Origin': '*' },
  writeToDisk: true,

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
}

export default devServer

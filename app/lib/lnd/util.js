import fs from 'fs'
import axios from 'axios'
import { promisify } from 'util'
import { basename, dirname, join, normalize } from 'path'
import { platform } from 'os'
import { app } from 'electron'
import isDev from 'electron-is-dev'
import { credentials, Metadata } from '@grpc/grpc-js'
import get from 'lodash.get'
import { mainLog } from '../utils/log'

const readFile = promisify(fs.readFile)
const stat = promisify(fs.stat)

// ------------------------------------
// Constants
// ------------------------------------

/**
 * Get a path to prepend to any nodejs calls that are getting at files in the package,
 * so that it works both from source and in an asar-packaged mac app.
 * See https://github.com/electron-userland/electron-builder/issues/751
 *
 * windows from source: "C:\myapp\node_modules\electron\dist\resources\default_app.asar"
 * mac from source: "/Users/me/dev/myapp/node_modules/electron/dist/Electron.app/Contents/Resources/default_app.asar"
 * mac from a package: <appRootPathsomewhere>"/my.app/Contents/Resources/app.asar"
 *
 * If we are run from outside of a packaged app, our working directory is the right place to be.
 * And no, we can't just set our working directory to somewhere inside the asar. The OS can't handle that.
 * @return {String} Path to the lnd binary.
 */
export const appRootPath = () => {
  return app.getAppPath().indexOf('default_app.asar') < 0 ? normalize(`${app.getAppPath()}/..`) : ''
}

/**
 * Get the OS specific lnd binary name.
 * @return {String} 'lnd' on mac or linux, 'lnd.exe' on windows.
 */
export const binaryName = platform() === 'win32' ? 'lnd.exe' : 'lnd'

/**
 * Get the OS specific path to the lnd binary.
 * @return {String} Path to the lnd binary.
 */
export const binaryPath = () => {
  return isDev
    ? join(dirname(require.resolve('lnd-binary/package.json')), 'vendor', binaryName)
    : join(appRootPath(), 'resources', 'bin', binaryName)
}

/**
 * Get the OS specific path to the rpc.proto files that are provided by lnd-grpc.
 * @return {String} Path to the rpc.proto files.
 */
export const lndGpcProtoPath = () => {
  return isDev
    ? join(dirname(require.resolve('lnd-grpc/package.json')), 'proto', 'lnrpc')
    : join(appRootPath(), 'resources', 'proto', 'lnrpc')
}

// ------------------------------------
// Helpers
// ------------------------------------

/**
 * Helper function to get the current block height.
 * @return {Number} The current block height.
 */
export const fetchBlockHeight = () => {
  const sources = [
    {
      baseUrl: `https://testnet-api.smartbit.com.au/v1/blockchain/blocks?limit=1`,
      path: 'blocks[0].height'
    },
    {
      baseUrl: `https://tchain.api.btc.com/v3/block/latest`,
      path: 'data.height'
    },
    {
      baseUrl: `https://api.blockcypher.com/v1/btc/test3`,
      path: 'height'
    }
  ]
  const fetchData = (baseUrl, path) => {
    mainLog.info(`Fetching current block height from ${baseUrl}`)
    return axios({
      method: 'get',
      timeout: 5000,
      url: baseUrl
    })
      .then(response => {
        const height = Number(get(response.data, path))
        mainLog.info(`Fetched block height as ${height} from: ${baseUrl}`)
        return height
      })
      .catch(err => {
        mainLog.warn(`Unable to fetch block height from ${baseUrl}: ${err.message}`)
      })
  }

  return Promise.race(sources.map(source => fetchData(source.baseUrl, source.path)))
}

/**
 * Helper function to return an absolute deadline given a relative timeout in seconds.
 * @param {number} timeoutSecs The number of seconds to wait before timing out
 * @return {Date} A date timeoutSecs in the future
 */
export const getDeadline = timeoutSecs => {
  var deadline = new Date()
  deadline.setSeconds(deadline.getSeconds() + timeoutSecs)
  return deadline.getTime()
}

/**
 * Validates and creates the ssl channel credentials from the specified file path
 * @param {String} certPath
 * @returns {grpc.ChanelCredentials}
 */
export const createSslCreds = async certPath => {
  let lndCert
  if (certPath) {
    lndCert = await readFile(certPath).catch(e => {
      const error = new Error(`SSL cert path could not be accessed: ${e.message}`)
      error.code = 'LND_GRPC_CERT_ERROR'
      throw error
    })
  }
  return credentials.createSsl(lndCert)
}

/**
 * Validates and creates the macaroon authorization credentials from the specified file path
 * @param {String} macaroonPath
 * @returns {grpc.CallCredentials}
 */
export const createMacaroonCreds = async macaroonPath => {
  const metadata = new Metadata()

  if (macaroonPath) {
    // If it's not a filepath, then assume it is a hex encoded string.
    if (macaroonPath === basename(macaroonPath)) {
      metadata.add('macaroon', macaroonPath)
    } else {
      const macaroon = await readFile(macaroonPath).catch(e => {
        const error = new Error(`Macaroon path could not be accessed: ${e.message}`)
        error.code = 'LND_GRPC_MACAROON_ERROR'
        throw error
      })
      metadata.add('macaroon', macaroon.toString('hex'))
    }
  }
  return credentials.createFromMetadataGenerator((params, callback) => callback(null, metadata))
}

/**
 * Wait for a file to exist.
 * @param {String} filepath
 */
export const waitForFile = (filepath, timeout = 1000) => {
  let timeoutId
  let intervalId

  // This promise rejects after the timeout has passed.
  let timeoutPromise = new Promise((resolve, reject) => {
    timeoutId = setTimeout(() => {
      mainLog.debug('deadline (%sms) exceeded before file (%s) was found', timeout, filepath)
      // Timout was reached, so clear all remaining timers.
      clearInterval(intervalId)
      clearTimeout(timeoutId)
      reject(new Error(`Unable to find file: ${filepath}`))
    }, timeout)
  })

  // This promise checks the filsystem every 200ms looking for the file, and resolves when the file has been found.
  let checkFileExists = new Promise(resolve => {
    let intervalId = setInterval(async () => {
      mainLog.debug('waiting for file: %s', filepath)
      try {
        await stat(filepath)
        mainLog.debug('found file: %s', filepath)
        // The file was found, so clear all remaining timers.
        clearInterval(intervalId)
        clearTimeout(timeoutId)
        resolve()
      } catch (e) {
        // If the file wasn't found with stat, do nothing, we will check again in 200ms.
        return
      }
    }, 200)
  })

  // Let's race our promises.
  return Promise.race([timeoutPromise, checkFileExists])
}

// The following options object closely approximates the existing behavior of grpc.load.
// See https://github.com/grpc/grpc-node/blob/master/packages/grpc-protobufjs/README.md
export const grpcOptions = {
  keepCase: true,
  longs: Number,
  enums: String,
  defaults: true,
  oneofs: true
}

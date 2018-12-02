import dns from 'dns'
import fs from 'fs'
import axios from 'axios'
import { promisify } from 'util'
import { basename, dirname, join, normalize } from 'path'
import { platform } from 'os'
import { app } from 'electron'
import isDev from 'electron-is-dev'
import { credentials, Metadata } from '@grpc/grpc-js'
import isFQDN from 'validator/lib/isFQDN'
import isIP from 'validator/lib/isIP'
import isPort from 'validator/lib/isPort'
import get from 'lodash.get'
import { mainLog } from '../utils/log'

const fsReadFile = promisify(fs.readFile)
const dnsLookup = promisify(dns.lookup)

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
    : join(appRootPath(), 'bin', binaryName)
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
 * Helper function to check a hostname in the format hostname:port is valid for passing to node-grpc.
 * @param {string} host A hostname + optional port in the format [hostname]:[port?]
 * @returns {Promise<Boolean>}
 */
export const validateHost = async host => {
  var splits = host.split(':')
  const lndHost = splits[0]
  const lndPort = splits[1]

  // If the hostname starts with a number, ensure that it is a valid IP address.
  if (!isFQDN(lndHost, { require_tld: false }) && !isIP(lndHost)) {
    const error = new Error(`${lndHost} is not a valid IP address or hostname`)
    error.code = 'LND_GRPC_HOST_ERROR'
    return Promise.reject(error)
  }

  // If the host includes a port, ensure that it is a valid.
  if (lndPort && !isPort(lndPort)) {
    const error = new Error(`${lndPort} is not a valid port`)
    error.code = 'LND_GRPC_HOST_ERROR'
    return Promise.reject(error)
  }

  // Do a DNS lookup to ensure that the host is reachable.
  return dnsLookup(lndHost)
    .then(() => true)
    .catch(e => {
      const error = new Error(`${lndHost} is not accessible: ${e.message}`)
      error.code = 'LND_GRPC_HOST_ERROR'
      return Promise.reject(error)
    })
}

/**
 * Validates and creates the ssl channel credentials from the specified file path
 * @param {String} certPath
 * @returns {grpc.ChanelCredentials}
 */
export const createSslCreds = async certPath => {
  let lndCert
  if (certPath) {
    lndCert = await fsReadFile(certPath).catch(e => {
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
      const macaroon = await fsReadFile(macaroonPath).catch(e => {
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

  // Promise A rejects after the timeout has passed.
  let promiseA = new Promise((resolve, reject) => {
    timeoutId = setTimeout(() => {
      mainLog.debug('deadline (%sms) exceeded before file (%s) was found', timeout, filepath)
      clearInterval(intervalId)
      clearTimeout(timeoutId)
      reject(new Error(`Unable to find file: ${filepath}`))
    }, timeout)
  })

  // Promise B resolves when the file has been found.
  let promiseB = new Promise(resolve => {
    let intervalId = setInterval(() => {
      mainLog.debug('waiting for file: %s', filepath)
      if (!fs.existsSync(filepath)) {
        return
      }
      mainLog.debug('found file: %s', filepath)
      clearInterval(intervalId)
      clearTimeout(timeoutId)
      resolve()
    }, 200)
  })

  // Let's race our promises.
  return Promise.race([promiseA, promiseB])
}

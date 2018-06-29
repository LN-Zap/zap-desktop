import dns from 'dns'
import fs from 'fs'
import axios from 'axios'
import { promisify } from 'util'
import { lookup } from 'ps-node'
import path from 'path'
import grpc from 'grpc'
import isIP from 'validator/lib/isIP'
import isPort from 'validator/lib/isPort'
import get from 'lodash.get'
import { mainLog } from '../utils/log'

const fsReadFile = promisify(fs.readFile)
const dnsLookup = promisify(dns.lookup)

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
  if (lndHost.match(/^\d/) && !isIP(lndHost)) {
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
  return grpc.credentials.createSsl(lndCert)
}

/**
 * Validates and creates the macaroon authorization credentials from the specified file path
 * @param {String} macaroonPath
 * @returns {grpc.CallCredentials}
 */
export const createMacaroonCreds = async macaroonPath => {
  const metadata = new grpc.Metadata()

  // If it's not a filepath, then assume it is a hex encoded string.
  if (macaroonPath === path.basename(macaroonPath)) {
    metadata.add('macaroon', macaroonPath)
  } else {
    const macaroon = await fsReadFile(macaroonPath).catch(e => {
      const error = new Error(`Macaroon path could not be accessed: ${e.message}`)
      error.code = 'LND_GRPC_MACAROON_ERROR'
      throw error
    })
    metadata.add('macaroon', macaroon.toString('hex'))
  }

  return grpc.credentials.createFromMetadataGenerator((params, callback) =>
    callback(null, metadata)
  )
}

/**
 * Check to see if an LND process is running.
 * @return {Promise} Boolean indicating wether an existing lnd process was found on the host machine.
 */
export const isLndRunning = () => {
  return new Promise((resolve, reject) => {
    mainLog.info('Looking for existing lnd process')
    lookup({ command: 'lnd' }, (err, results) => {
      // There was an error checking for the LND process.
      if (err) {
        return reject(err)
      }

      if (!results.length) {
        // An LND process was found, no need to start our own.
        mainLog.info('Existing lnd process not found')
        return resolve(false)
      }
      mainLog.info('Found existing lnd process')
      return resolve(true)
    })
  })
}

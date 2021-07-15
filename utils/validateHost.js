import dns from 'dns'
import { promisify } from 'util'

import isFQDN from 'validator/lib/isFQDN'
import isIP from 'validator/lib/isIP'
import isPort from 'validator/lib/isPort'

import splitHostname from '@zap/utils/splitHostname'

const dnsLookup = promisify(dns.lookup)

/**
 * validateHost - Helper function to check a hostname in the format hostname:port.
 *
 * @param {string} host A hostname + optional port in the format [hostname]:[port?]
 * @returns {Promise<boolean>} Boolean indicating whether host is valid
 */
const validateHost = async host => {
  const createError = (msg, code) => {
    const error = new Error(msg)
    error.code = code
    return Promise.reject(error)
  }

  try {
    const { host: lndHost, port: lndPort } = splitHostname(host)

    // If the host includes a port, ensure that it is a valid.
    if (lndPort && !isPort(lndPort)) {
      return createError(`${lndPort} is not a valid port`, 'LND_GRPC_HOST_ERROR')
    }

    if (lndHost.endsWith('.onion')) {
      return true
    }

    // If the hostname starts with a number, ensure that it is a valid IP address.
    if (!isFQDN(lndHost, { require_tld: false }) && !isIP(lndHost)) {
      return createError(`${lndHost} is not a valid IP address or hostname`, 'LND_GRPC_HOST_ERROR')
    }

    try {
      // Do a DNS lookup to ensure that the host is reachable.
      await dnsLookup(lndHost)
      return true
    } catch (e) {
      return createError(`${lndHost} is not accessible: ${e.message}`)
    }
  } catch (e) {
    return createError(`Host is invalid: ${e.message}`, 'LND_GRPC_HOST_ERROR')
  }
}

export default validateHost

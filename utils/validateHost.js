import dns from 'dns'
import { promisify } from 'util'
import isFQDN from 'validator/lib/isFQDN'
import isIP from 'validator/lib/isIP'
import isPort from 'validator/lib/isPort'

const dnsLookup = promisify(dns.lookup)

/**
 * Helper function to check a hostname in the format hostname:port is valid for passing to node-grpc.
 * @param {string} host A hostname + optional port in the format [hostname]:[port?]
 * @returns {Promise<Boolean>}
 */
const validateHost = async host => {
  const createError = (msg, code) => {
    const error = new Error(msg)
    error.code = code
    return Promise.reject(error)
  }

  try {
    const [lndHost, lndPort] = host.split(':')

    // If the hostname starts with a number, ensure that it is a valid IP address.
    if (!isFQDN(lndHost, { require_tld: false }) && !isIP(lndHost)) {
      return createError(`${lndHost} is not a valid IP address or hostname`, 'LND_GRPC_HOST_ERROR')
    }

    // If the host includes a port, ensure that it is a valid.
    if (lndPort && !isPort(lndPort)) {
      return createError(`${lndPort} is not a valid port`, 'LND_GRPC_HOST_ERROR')
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

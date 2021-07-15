import config from 'config'
import getPort from 'get-port'

/**
 * getLndListen - Find a port for lnd to listen on.
 *
 * @param {string} type Interface type (p2p|grpc|rest)
 * @returns {string} host:port
 */
const getLndListen = async type => {
  if (config.lnd[type].host) {
    const port = await getPort({
      host: config.lnd[type].host,
      port: config.lnd[type].port,
    })
    return `${config.lnd[type].host}:${port}`
  }
  return 0
}

export default getLndListen

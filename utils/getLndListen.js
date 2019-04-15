import getPort from 'get-port'
import config from 'config'

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

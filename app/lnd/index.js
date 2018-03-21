import config from './config'
import lightning from './lib/lightning'
import subscribe from './subscribe'
import methods from './methods'

export default (callback) => {
  const lnd = lightning(config.lightningRpc, config.lightningHost)

  const lndSubscribe = mainWindow => subscribe(mainWindow, lnd)
  const lndMethods = (event, msg, data) => methods(lnd, event, msg, data)
  callback(lndSubscribe, lndMethods)
}

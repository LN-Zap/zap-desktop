import config from './config'
import lightning from './lib/lightning'
import walletUnlocker from './lib/walletUnlocker'
import subscribe from './subscribe'
import methods from './methods'
import walletUnlockerMethods from './walletUnlockerMethods'

const initLnd = (callback) => {
  const lnd = lightning(config.lightningRpc, config.lightningHost)

  const lndSubscribe = mainWindow => subscribe(mainWindow, lnd)
  const lndMethods = (event, msg, data) => methods(lnd, event, msg, data)

  callback(lndSubscribe, lndMethods)
}

const initWalletUnlocker = (callback) => {
  const walletUnlockerObj = walletUnlocker(config.lightningRpc, config.lightningHost)
  const walletUnlockerMethodsCallback = (event, msg, data) => walletUnlockerMethods(walletUnlockerObj, event, msg, data)

  callback(walletUnlockerMethodsCallback)
}

export default {
  initLnd,
  initWalletUnlocker
}

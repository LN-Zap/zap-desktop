import config from './config'
import lightning from './lib/lightning'
import walletUnlocker from './lib/walletUnlocker'
import subscribe from './subscribe'
import methods from './methods'
import walletUnlockerMethods from './walletUnlockerMethods'

const initLnd = (callback) => {
  const lndConfig = config.lnd()
  const lnd = lightning(lndConfig.lightningRpc, lndConfig.lightningHost)

  const lndSubscribe = mainWindow => subscribe(mainWindow, lnd)
  const lndMethods = (event, msg, data) => methods(lnd, event, msg, data)

  callback(lndSubscribe, lndMethods)
}

const initWalletUnlocker = (callback) => {
  const lndConfig = config.lnd()

  const walletUnlockerObj = walletUnlocker(lndConfig.lightningRpc, lndConfig.lightningHost)
  const walletUnlockerMethodsCallback = (event, msg, data) => walletUnlockerMethods(walletUnlockerObj, event, msg, data)

  callback(walletUnlockerMethodsCallback)
}

export default {
  initLnd,
  initWalletUnlocker
}

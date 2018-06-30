import config from './config'
import lightning from './lib/lightning'
import walletUnlocker from './lib/walletUnlocker'
import { isLndRunning } from './lib/util'
import subscribe from './subscribe'
import methods from './methods'
import walletUnlockerMethods from './walletUnlockerMethods'
// use mainLog because lndLog is reserved for the lnd binary itself
import { mainLog } from '../utils/log'

const initLnd = async () => {
  const lnd = await lightning()

  const lndSubscribe = mainWindow => subscribe(mainWindow, lnd, mainLog)
  const lndMethods = (event, msg, data) => methods(lnd, mainLog, event, msg, data)

  return Promise.resolve({
    lndSubscribe,
    lndMethods
  })
}

const initWalletUnlocker = () => {
  const lndConfig = config.lnd()
  const walletUnlockerObj = walletUnlocker(lndConfig.rpcProtoPath, lndConfig.host)
  const walletUnlockerMethodsCallback = (event, msg, data) =>
    walletUnlockerMethods(walletUnlockerObj, mainLog, event, msg, data)

  return walletUnlockerMethodsCallback
}

export default {
  initLnd,
  initWalletUnlocker,
  isLndRunning
}

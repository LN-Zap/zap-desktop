import config from './config'
import walletUnlocker from './walletUnlocker'
import walletUnlockerMethods from './walletUnlockerMethods'
// use mainLog because lndLog is reserved for the lnd binary itself
import { mainLog } from '../utils/log'

const initWalletUnlocker = () => {
  const lndConfig = config.lnd()
  const walletUnlockerObj = walletUnlocker(lndConfig.rpcProtoPath, lndConfig.host)
  const walletUnlockerMethodsCallback = (event, msg, data) =>
    walletUnlockerMethods(walletUnlockerObj, mainLog, event, msg, data)

  return walletUnlockerMethodsCallback
}

export default {
  initWalletUnlocker
}

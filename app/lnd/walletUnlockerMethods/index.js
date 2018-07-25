import { dirname } from 'path'
import * as walletController from '../methods/walletController'
import config from '../config'

export default function(walletUnlocker, log, event, msg, data) {
  const lndConfig = config.lnd()

  const decorateError = error => {
    switch (error.code) {
      // wallet already exists
      case 2:
        error.context = {
          lndDataDir: dirname(lndConfig.cert)
        }
    }
    return error
  }

  log.info(`Calling walletUnlocker method '${msg}'`)
  switch (msg) {
    case 'genSeed':
      walletController
        .genSeed(walletUnlocker)
        .then(genSeedData => event.sender.send('receiveSeed', genSeedData))
        .catch(error => event.sender.send('receiveSeedError', decorateError(error)))
      break
    case 'unlockWallet':
      walletController
        .unlockWallet(walletUnlocker, data)
        .then(() => event.sender.send('walletUnlocked'))
        .catch(() => event.sender.send('unlockWalletError'))
      break
    case 'initWallet':
      walletController
        .initWallet(walletUnlocker, data)
        .then(() => event.sender.send('successfullyCreatedWallet'))
        .catch(error => log.error('initWallet:', error))
      break
    default:
  }
}

import { dirname } from 'path'
import * as walletController from '../methods/walletController'

export default function(walletUnlocker, log, event, msg, data, lndConfig) {
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
        .catch(e => event.sender.send('setUnlockWalletError', e.message))
      break
    case 'initWallet':
      walletController
        .initWallet(walletUnlocker, data)
        .then(() => event.sender.send('walletCreated'))
        .catch(error => log.error('initWallet:', error))
      break
    default:
  }
}

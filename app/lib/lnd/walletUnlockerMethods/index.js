import * as walletController from '../methods/walletController'

export default function(walletUnlocker, log, event, msg, data) {
  switch (msg) {
    case 'genSeed':
      walletController
        .genSeed(walletUnlocker)
        .then(genSeedData => event.sender.send('receiveSeed', genSeedData))
        .catch(error => event.sender.send('receiveSeedError', error))
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

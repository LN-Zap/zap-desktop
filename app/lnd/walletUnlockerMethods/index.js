/* eslint no-console: 0 */ // --> OFF

import * as walletController from '../methods/walletController'

export default function(walletUnlocker, event, msg, data) {
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
        .catch(error => console.log('initWallet error: ', error))
      break
    default:
  }
}

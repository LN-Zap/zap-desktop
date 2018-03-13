/* eslint no-console: 0 */ // --> OFF

import * as walletController from '../methods/walletController'

export default function (walletUnlocker, event, msg, data) {
  switch (msg) {
    case 'genSeed':
      walletController.genSeed(walletUnlocker)
      .then(data => {
        console.log('data yo: ', data)
        event.sender.send('receiveSeed', data)
      })
      .catch(error => {
        console.log('genSeed error: ', error)
        event.sender.send('receiveSeedError', error)
      })
      break
    case 'unlockWallet':
      walletController.unlockWallet(walletUnlocker, data)
      .then(data => event.sender.send('walletUnlocked'))
      .catch(error => event.sender.send('unlockWalletError'))
      break
    case 'initWallet':
      walletController.initWallet(walletUnlocker, data)
      .then(data => event.sender.send('successfullyCreatedWallet'))
      .catch(error => console.log('initWallet error: ', error))
      break
    default:
  }
}

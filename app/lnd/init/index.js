/* eslint no-console: 0 */ // --> OFF
import * as walletController from '../methods/walletController'

export default function (walletUnlocker, meta, event, msg, data) {
  console.log('msg yo wtf: ', msg)
  switch (msg) {
    case 'genSeed':
      walletController.genSeed(walletUnlocker, meta)
      .then(data => { console.log('data: ', data) })
      .catch(error => { console.log('error: ', error) })
    default:
  }
}

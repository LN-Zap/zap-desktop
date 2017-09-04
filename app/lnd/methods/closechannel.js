import bitcore from 'bitcore-lib'
import pushclosechannel from '../push/closechannel'

export default function closechannel(lnd, event, payload) {
  console.log('payload: ', payload)
  return new Promise((resolve, reject) =>
    pushclosechannel(lnd, event, payload)
      .then(data => resolve(data))
      .catch(error => reject(error))
  )
}
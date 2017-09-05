import bitcore from 'bitcore-lib'
import pushclosechannel from '../push/closechannel'

const BufferUtil = bitcore.util.buffer

export default function closechannel(lnd, event, payload) {
  const tx = payload.channel_point.funding_txid.match(/.{2}/g).reverse().join('')
  const res = {
    channel_point: {
      funding_txid: BufferUtil.hexToBuffer(tx),
      output_index: Number(payload.channel_point.output_index)
    }
  }

  return new Promise((resolve, reject) =>
    pushclosechannel(lnd, event, res)
      .then(data => resolve(data))
      .catch(error => reject(error))
  )
}

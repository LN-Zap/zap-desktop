import bitcore from 'bitcore-lib'
import pushchannel from '../push/channel'

const BufferUtil = bitcore.util.buffer

export default function openchannel(lnd, event, payload) {
  const { pubkey, localamt, pushamt } = payload
  const res = {
    node_pubkey: BufferUtil.hexToBuffer(pubkey),
    local_funding_amount: Number(localamt),
    push_sat: Number(pushamt)
  }

  return new Promise((resolve, reject) =>
    pushchannel(lnd, event, res)
      .then(data => resolve(data))
      .catch(error => reject(error))
  )
}

import pushchannel from '../push/channel'
import bitcore from 'bitcore-lib'
const BufferUtil = bitcore.util.buffer

export default function openchannel(lnd, event, data) {
  const { pubkey, localamt, pushamt } = data
  const payload = { 
    node_pubkey: BufferUtil.hexToBuffer(pubkey),
    local_funding_amount: Number(localamt), 
    push_sat: Number(pushamt) 
  }

  return new Promise((resolve, reject) => 
    pushchannel(lnd, event, payload)
    .then(data => resolve(data))
    .catch(error => reject(err))
  )
}
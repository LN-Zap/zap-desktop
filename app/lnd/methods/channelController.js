import bitcore from 'bitcore-lib'
import pushopenchannel from '../push/openchannel'
import pushclosechannel from '../push/closechannel'

const BufferUtil = bitcore.util.buffer

/**
 * Attempts to open a singly funded channel specified in the request to a remote peer.
 * @param  {[type]} lnd     [description]
 * @param  {[type]} event   [description]
 * @param  {[type]} payload [description]
 * @return {[type]}         [description]
 */
export function openChannel(lnd, event, payload) {
  const { pubkey, localamt, pushamt } = payload
  const res = {
    node_pubkey: BufferUtil.hexToBuffer(pubkey),
    local_funding_amount: Number(localamt),
    push_sat: Number(pushamt)
  }

  return new Promise((resolve, reject) =>
    pushopenchannel(lnd, event, res)
      .then(data => resolve(data))
      .catch(error => reject(error))
  )
}


/**
 * Returns the total funds available across all open channels in satoshis
 * @param  {[type]} lnd [description]
 * @return {[type]}     [description]
 */
export function channelBalance(lnd) {
  return new Promise((resolve, reject) => {
    lnd.channelBalance({}, (err, data) => {
      if (err) { reject(err) }

      resolve(data)
    })
  })
}


/**
 * Returns a description of all the open channels that this node is a participant in
 * @param  {[type]} lnd [description]
 * @return {[type]}     [description]
 */
export function listChannels(lnd) {
  return new Promise((resolve, reject) => {
    lnd.listChannels({}, (err, data) => {
      if (err) { reject(err) }

      resolve(data)
    })
  })
}


/**
 * Attempts to close an active channel identified by its channel outpoint (ChannelPoint)
 * @param  {[type]} lnd     [description]
 * @param  {[type]} event   [description]
 * @param  {[type]} payload [description]
 * @return {[type]}         [description]
 */
export function closeChannel(lnd, event, payload) {
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


/**
 * Returns a list of all the channels that are currently considered “pending"
 * @param  {[type]} lnd [description]
 * @return {[type]}     [description]
 */
export function pendingChannels(lnd) {
  return new Promise((resolve, reject) => {
    lnd.pendingChannels({}, (err, data) => {
      if (err) { reject(err) }

      resolve(data)
    })
  })
}


/**
 * Returns the latest authenticated network announcement for the given channel
 * @param  {[type]} lnd       [description]
 * @param  {[type]} channelId [description]
 * @return {[type]}           [description]
 */
export function getChanInfo(lnd, { chanId }) {
  return new Promise((resolve, reject) => {
    lnd.getChanInfo({ chan_id: chanId }, (err, data) => {
      if (err) { reject(err) }

      resolve(data)
    })
  })
}

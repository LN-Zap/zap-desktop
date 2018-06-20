import find from 'lodash/find'
import { listPeers, connectPeer } from './peersController'
import pushopenchannel from '../push/openchannel'

function ensurePeerConnected(lnd, pubkey, host) {
  return listPeers(lnd).then(({ peers }) => {
    const peer = find(peers, { pub_key: pubkey })
    if (peer) {
      return peer
    }
    return connectPeer(lnd, { pubkey, host })
  })
}

/**
 * Attempts to open a singly funded channel specified in the request to a remote peer.
 * @param  {[type]} lnd     [description]
 * @param  {[type]} event   [description]
 * @param  {[type]} payload [description]
 * @return {[type]}         [description]
 */
export function connectAndOpen(lnd, event, payload) {
  const { pubkey, host, localamt } = payload

  return ensurePeerConnected(lnd, pubkey, host)
    .then(() => {
      const call = lnd.openChannel({
        node_pubkey: Buffer.from(pubkey, 'hex'),
        local_funding_amount: Number(localamt)
      })

      call.on('data', data => event.sender.send('pushchannelupdated', { pubkey, data }))
      call.on('error', error => event.sender.send('pushchannelerror', { pubkey, error: error.toString() }))

      return call
    })
    .catch(err => {
      event.sender.send('pushchannelerror', { pubkey, error: err.toString() })
      throw err
    })
}

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
    node_pubkey: Buffer.from(pubkey, 'hex'),
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
      if (err) {
        reject(err)
      }

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
      if (err) {
        reject(err)
      }

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
  const {
    channel_point: { funding_txid, output_index },
    chan_id,
    force
  } = payload
  const tx = funding_txid
    .match(/.{2}/g)
    .reverse()
    .join('')

  const res = {
    channel_point: {
      funding_txid_bytes: Buffer.from(tx, 'hex'),
      output_index: Number(output_index)
    },
    force
  }

  return new Promise((resolve, reject) => {
    try {
      const call = lnd.closeChannel(res)

      call.on('data', data => event.sender.send('pushclosechannelupdated', { data, chan_id }))
      call.on('end', () => event.sender.send('pushclosechannelend'))
      call.on('error', error => event.sender.send('pushclosechannelerror', { error: error.toString(), chan_id }))
      call.on('status', status => event.sender.send('pushclosechannelstatus', { status, chan_id }))

      resolve(null, res)
    } catch (error) {
      reject(error, null)
    }
  })
}

/**
 * Returns a list of all the channels that are currently considered “pending"
 * @param  {[type]} lnd [description]
 * @return {[type]}     [description]
 */
export function pendingChannels(lnd) {
  return new Promise((resolve, reject) => {
    lnd.pendingChannels({}, (err, data) => {
      if (err) {
        reject(err)
      }

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
      if (err) {
        reject(err)
      }

      resolve(data)
    })
  })
}

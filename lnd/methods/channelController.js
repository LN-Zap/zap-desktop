import { promisifiedCall } from '@zap/utils'
import { listPeers, connectPeer } from './peersController'
import pushopenchannel from '../push/openchannel'

function ensurePeerConnected(lnd, pubkey, host) {
  return listPeers(lnd).then(({ peers }) => {
    const peer = peers.find(candidatePeer => candidatePeer.pub_key === pubkey)
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
export async function connectAndOpen(lnd, event, payload) {
  const { pubkey, host, localamt, private: privateChannel, satPerByte, spendUnconfirmed } = payload
  const req = {
    node_pubkey: Buffer.from(pubkey, 'hex'),
    local_funding_amount: Number(localamt),
    private: privateChannel,
    sat_per_byte: satPerByte,
    spend_unconfirmed: spendUnconfirmed,
  }
  try {
    await ensurePeerConnected(lnd, pubkey, host)
  } catch (err) {
    event.sender.send('pushchannelerror', {
      ...req,
      node_pubkey: pubkey,
      error: err.toString(),
    })
    throw err
  }
  return pushopenchannel(lnd, event, req)
}

/**
 * Returns the total funds available across all open channels in satoshis
 * @param  {[type]} lnd [description]
 * @return {[type]}     [description]
 */
export function channelBalance(lnd) {
  return promisifiedCall(lnd, lnd.channelBalance, {})
}

/**
 * Returns a description of all the open channels that this node is a participant in
 * @param  {[type]} lnd [description]
 * @return {[type]}     [description]
 */
export function listChannels(lnd) {
  return promisifiedCall(lnd, lnd.listChannels, {})
}

/**
 * Returns a description of all the closed channels that this node was a participant in.
 * @param  {[type]} lnd [description]
 * @return {[type]}     [description]
 */
export function closedChannels(lnd) {
  return promisifiedCall(lnd, lnd.closedChannels, {})
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
    force,
  } = payload
  const tx = funding_txid
    .match(/.{2}/g)
    .reverse()
    .join('')

  const res = {
    channel_point: {
      funding_txid_bytes: Buffer.from(tx, 'hex'),
      output_index: Number(output_index),
    },
    force,
  }

  return new Promise((resolve, reject) => {
    try {
      const call = lnd.closeChannel(res)

      call.on('data', data => event.sender.send('pushclosechannelupdated', { data, chan_id }))
      call.on('end', () => event.sender.send('pushclosechannelend'))
      call.on('error', error =>
        event.sender.send('pushclosechannelerror', { error: error.toString(), chan_id })
      )
      call.on('status', status => event.sender.send('pushclosechannelstatus', { status, chan_id }))

      resolve(call)
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Returns a list of all the channels that are currently considered “pending"
 * @param  {[type]} lnd [description]
 * @return {[type]}     [description]
 */
export function pendingChannels(lnd) {
  return promisifiedCall(lnd, lnd.pendingChannels, {})
}

/**
 * Returns the latest authenticated network announcement for the given channel
 * @param  {[type]} lnd       [description]
 * @param  {[type]} chanId    [description]
 * @return {[type]}           [description]
 */
export function getChanInfo(lnd, { chanId }) {
  return promisifiedCall(lnd, lnd.getChanInfo, { chan_id: chanId })
}

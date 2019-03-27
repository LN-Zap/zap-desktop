import { promisifiedCall } from '@zap/utils'
/**
 * Attempts to establish a connection to a remote peer
 * @param  {[type]} lnd    [description]
 * @param  {[type]} pubkey [description]
 * @param  {[type]} host   [description]
 * @return {[type]}        [description]
 */
export function connectPeer(lnd, { pubkey, host }) {
  return promisifiedCall(lnd, lnd.connectPeer, { addr: { pubkey, host } })
}

/**
 * Attempts to disconnect one peer from another
 * @param  {[type]} lnd    [description]
 * @param  {[type]} pubkey [description]
 * @return {[type]}        [description]
 */
export function disconnectPeer(lnd, { pubkey }) {
  return promisifiedCall(lnd, lnd.disconnectPeer, { pub_key: pubkey })
}

/**
 * Returns a verbose listing of all currently active peers
 * @param  {[type]} lnd [description]
 * @return {[type]}     [description]
 */
export function listPeers(lnd) {
  return promisifiedCall(lnd, lnd.listPeers, {})
}

/**
 * Attempts to establish a connection to a remote peer
 * @param  {[type]} lnd    [description]
 * @param  {[type]} pubkey [description]
 * @param  {[type]} host   [description]
 * @return {[type]}        [description]
 */
export function connectPeer(lnd, meta, { pubkey, host }) {
  return new Promise((resolve, reject) => {
    lnd.connectPeer({ addr: { pubkey, host }, perm: true }, meta, (err, data) => {
      if (err) { reject(err) }

      resolve(data)
    })
  })
}


/**
 * Attempts to disconnect one peer from another
 * @param  {[type]} lnd    [description]
 * @param  {[type]} pubkey [description]
 * @return {[type]}        [description]
 */
export function disconnectPeer(lnd, meta, { pubkey }) {
  return new Promise((resolve, reject) => {
    lnd.disconnectPeer({ pub_key: pubkey }, meta, (err, data) => {
      if (err) { reject(err) }

      resolve(data)
    })
  })
}


/**
 * Returns a verbose listing of all currently active peers
 * @param  {[type]} lnd [description]
 * @return {[type]}     [description]
 */
export function listPeers(lnd, meta) {
  return new Promise((resolve, reject) => {
    lnd.listPeers({}, meta, (err, data) => {
      if (err) { reject(err) }

      resolve(data)
    })
  })
}

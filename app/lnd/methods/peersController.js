/**
 * Attempts to establish a connection to a remote peer
 * @param  {[type]} lnd    [description]
 * @param  {[type]} pubkey [description]
 * @param  {[type]} host   [description]
 * @return {[type]}        [description]
 */
export function connectPeer(lnd, { pubkey, host }) {
  return new Promise((resolve, reject) => {
    lnd.connectPeer({ addr: { pubkey, host }, perm: true }, (err, data) => {
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
export function disconnectPeer(lnd, { pubkey }) {
  return new Promise((resolve, reject) => {
    lnd.disconnectPeer({ pub_key: pubkey }, (err, data) => {
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
export function listPeers(lnd) {
  return new Promise((resolve, reject) => {
    lnd.listPeers({}, (err, data) => {
      if (err) { reject(err) }

      resolve(data)
    })
  })
}

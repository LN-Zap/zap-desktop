// LND Connect to a peer
export default function connectpeer(lnd, { pubkey, host }) {
  return new Promise((resolve, reject) => {
    lnd.connectPeer({ addr: { pubkey, host }, perm: true }, (err, data) => {
      if (err) { reject(err) }

      resolve(data)
    })
  })
}

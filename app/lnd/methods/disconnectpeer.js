// LND Disconnect from a peer
export default function disconnectpeer(lnd, { pubkey }) {
  return new Promise((resolve, reject) => {
    lnd.disconnectPeer({ pub_key: pubkey }, (err, data) => {
      if (err) { reject(err) }

      resolve(data)
    })
  })
}

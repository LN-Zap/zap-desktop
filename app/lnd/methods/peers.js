// LND List Peers
export default function peers(lnd) {
  return new Promise((resolve, reject) => {
    lnd.listPeers({}, (err, data) => {
      if (err) { reject(err) }

      resolve(data)
    })
  })
}
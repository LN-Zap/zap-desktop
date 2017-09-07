// LND Get Pending Channels
export default function channels(lnd) {
  return new Promise((resolve, reject) => {
    lnd.pendingChannels({}, (err, data) => {
      if (err) { reject(err) }

      resolve(data)
    })
  })
}

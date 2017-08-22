// LND List Channels
export default function channels(lnd) {
  return new Promise((resolve, reject) => {
    lnd.listChannels({}, (err, data) => {
      if (err) { reject(err) }

      resolve(data)
    })
  })
}

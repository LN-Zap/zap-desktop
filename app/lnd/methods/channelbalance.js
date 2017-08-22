// LND Get Channel Balance
export default function channelbalance(lnd) {
  return new Promise((resolve, reject) => {
    lnd.channelBalance({}, (err, data) => {
      if (err) { reject(err) }

      resolve(data)
    })
  })
}
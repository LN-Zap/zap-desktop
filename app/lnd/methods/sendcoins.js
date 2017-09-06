// LND send coins on chain
export default function sendcoins(lnd, { addr, amount }) {
  return new Promise((resolve, reject) => {
    lnd.sendCoins({ addr, amount }, (err, data) => {
      if (err) { reject(err) }

      resolve(data)
    })
  })
}

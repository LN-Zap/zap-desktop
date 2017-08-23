// LND Get Wallet Balance
export default function walletbalance(lnd) {
  return new Promise((resolve, reject) => {
    lnd.walletBalance({}, (err, data) => {
      if (err) { reject(err) }

      resolve(data)
    })
  })
}

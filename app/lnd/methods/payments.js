// LND Get Payments
export default function payments(lnd) {
  return new Promise((resolve, reject) => {
    lnd.listPayments({}, (err, data) => {
      if (err) { reject(err) }
      
      resolve(data)
    })
  })
}
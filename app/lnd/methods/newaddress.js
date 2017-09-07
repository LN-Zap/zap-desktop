// LND Generate New Address
export default function info(lnd, type) {
  return new Promise((resolve, reject) => {
    lnd.newAddress({ type }, (err, data) => {
      if (err) { reject(err) }

      resolve(data)
    })
  })
}

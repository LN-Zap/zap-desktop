// LND Get Info
export default function info(lnd) {
  return new Promise((resolve, reject) => {
    lnd.getInfo({}, (err, data) => {
      if (err) { reject(err) }

      resolve(data)
    })
  })
}

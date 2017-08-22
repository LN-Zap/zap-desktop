// LND Create an invoice
export function createInvoice(lnd, { memo, value }) {
  return new Promise((resolve, reject) => {
    lnd.addInvoice({ memo, value }, (err, data) => {
      if (err) { reject(err) }
      
      resolve(data)
    })
  })
}
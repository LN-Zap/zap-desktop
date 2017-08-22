// LND Get Invoices
export default function invoices(lnd) {
  return new Promise((resolve, reject) => {
    lnd.listInvoices({}, (err, data) => {
      if (err) { reject(err) }
      
      resolve(data)
    })
  })
}
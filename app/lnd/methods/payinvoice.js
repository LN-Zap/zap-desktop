// LND Pay an invoice
export default function payinvoice(lnd, { paymentRequest }) {
  return new Promise((resolve, reject) => {
    lnd.sendPaymentSync({ payment_request: paymentRequest }, (err, data) => {
      if (err) { reject(err) }

      resolve(data)
    })
  })
}

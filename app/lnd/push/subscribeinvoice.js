export default function pushinvoices(lnd, meta, event) {
  return new Promise((resolve, reject) => {
    try {
      const call = lnd.subscribeInvoices({}, meta)

      call.on('data', data => event.sender.send('pushinvoicesupdated', { data }))
      call.on('end', () => event.sender.send('pushinvoicesend'))
      call.on('error', error => event.sender.send('pushinvoiceserror', { error }))
      call.on('status', status => event.sender.send('pushinvoicesstatus', { status }))

      resolve(null)
    } catch (error) {
      reject(error, null)
    }
  })
}

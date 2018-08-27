export default function pushinvoices(lnd, event) {
  return new Promise((resolve, reject) => {
    try {
      const call = lnd.subscribeInvoices({})

      call.on('data', data => event.sender.send('pushinvoicesupdated', { data }))
      call.on('end', () => event.sender.send('pushinvoicesend'))
      call.on('error', error => event.sender.send('pushinvoiceserror', { error }))
      call.on('status', status => event.sender.send('pushinvoicesstatus', { status }))

      resolve(call)
    } catch (error) {
      reject(error)
    }
  })
}

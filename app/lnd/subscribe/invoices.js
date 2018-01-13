export default function subscribeToInvoices(mainWindow, lnd, meta) {
  const call = lnd.subscribeInvoices({}, meta)

  call.on('data', invoice => mainWindow.send('invoiceUpdate', { invoice }))
  call.on('end', () => console.log('end'))
  call.on('error', error => console.log('error: ', error))
  call.on('status', status => console.log('status: ', status))
}

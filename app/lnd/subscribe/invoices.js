export default function subscribeToInvoices(mainWindow, lnd, log) {
  const call = lnd.subscribeInvoices({})

  call.on('data', invoice => mainWindow.send('invoiceUpdate', { invoice }))
  call.on('end', () => log.info('end'))
  call.on('error', error => log.error(error))
  call.on('status', status => log.info('status:', status))
}

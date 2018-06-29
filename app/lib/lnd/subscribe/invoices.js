import { status } from 'grpc'

export default function subscribeToInvoices(mainWindow, lnd, log) {
  const call = lnd.subscribeInvoices({})

  call.on('data', invoice => {
    log.info('INVOICE:', invoice)
    mainWindow.send('invoiceUpdate', { invoice })
  })
  call.on('end', () => log.info('end'))
  call.on('error', error => error.code !== status.CANCELLED && log.error(error))
  call.on('status', status => log.info('INVOICE STATUS:', status))

  return call
}

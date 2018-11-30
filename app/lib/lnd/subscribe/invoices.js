import { status } from '@grpc/grpc-js'
import { mainLog } from '../../utils/log'

export default function subscribeToInvoices() {
  const call = this.service.subscribeInvoices({})

  call.on('data', invoice => {
    mainLog.info('INVOICE:', invoice)
    if (this.mainWindow) {
      this.mainWindow.send('invoiceUpdate', { invoice })
    }
  })
  call.on('end', () => mainLog.info('end'))
  call.on('error', error => error.code !== status.CANCELLED && mainLog.error(error))
  call.on('status', status => mainLog.info('INVOICE STATUS:', status))

  return call
}

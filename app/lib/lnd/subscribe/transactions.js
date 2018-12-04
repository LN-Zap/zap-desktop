import { status } from '@grpc/grpc-js'
import { mainLog } from '../../utils/log'

export default function subscribeToTransactions() {
  const call = this.service.subscribeTransactions({})

  call.on('data', transaction => {
    mainLog.info('TRANSACTION:', transaction)
    if (this.mainWindow) {
      this.mainWindow.send('newTransaction', { transaction })
    }
  })
  call.on('end', () => mainLog.info('TRANSACTION END'))
  call.on('error', error => error.code !== status.CANCELLED && mainLog.error(error))
  call.on('status', status => mainLog.info('TRANSACTION STATUS: ', status))

  return call
}

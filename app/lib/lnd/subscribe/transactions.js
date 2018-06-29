import { status } from 'grpc'

export default function subscribeToTransactions(mainWindow, lnd, log) {
  const call = lnd.subscribeTransactions({})

  call.on('data', transaction => {
    log.info('TRANSACTION:', transaction)
    mainWindow.send('newTransaction', { transaction })
  })
  call.on('end', () => log.info('end'))
  call.on('error', error => error.code !== status.CANCELLED && log.error(error))
  call.on('status', status => log.info('TRANSACTION STATUS: ', status))

  return call
}

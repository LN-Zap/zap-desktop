export default function subscribeToTransactions(mainWindow, lnd, log) {
  const call = lnd.subscribeTransactions({})
  call.on('data', transaction => {
    lnd.log.info('TRANSACTION:', transaction)
    mainWindow.send('newTransaction', { transaction })
  })
  call.on('end', () => log.info('end'))
  call.on('error', error => log.error('error: ', error))
  call.on('status', status => log.info('TRANSACTION STATUS: ', status))
}

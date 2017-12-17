/* eslint-disable */

export default function subscribeToTransactions(mainWindow, lnd, metadata) {
  const call = lnd.subscribeTransactions({}, metadata)
  call.on('data', transaction => {
    console.log('TRANSACTION: ', transaction)
    mainWindow.send('newTransaction', { transaction })
  })
  call.on('end', () => console.log('end'))
  call.on('error', error => console.log('error: ', error))
  call.on('status', status => console.log('TRANSACTION STATUS: ', status))
}

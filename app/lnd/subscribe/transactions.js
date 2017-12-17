/* eslint-disable */

export default function subscribeToTransactions(mainWindow, lnd, meta) {
  const call = lnd.subscribeTransactions({}, meta)
  call.on('data', transaction => {
    console.log('TRANSACTION: ', transaction)
    mainWindow.send('newTransaction', { transaction })
  })
  call.on('end', () => console.log('end'))
  call.on('error', error => console.log('error: ', error))
  call.on('status', status => console.log('TRANSACTION STATUS: ', status))
}

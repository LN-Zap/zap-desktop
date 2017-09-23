/* eslint-disable */

export default function subscribeToTransactions(mainWindow, lnd) {
  const call = lnd.subscribeTransactions({})

  call.on('data', transaction => mainWindow.send('newTransaction', { transaction }))
  call.on('end', () => console.log('end'))
  call.on('error', error => console.log('error: ', error))
  call.on('status', status => console.log('status: ', status))
}

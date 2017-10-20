import subscribeToTransactions from './transactions'
import subscribeToInvoices from './invoices'

export default (mainWindow, lnd) => {
  console.log('mainWindow: ', mainWindow)
  console.log('lnd: ', lnd)
  subscribeToTransactions(mainWindow, lnd)
  subscribeToInvoices(mainWindow, lnd)
}

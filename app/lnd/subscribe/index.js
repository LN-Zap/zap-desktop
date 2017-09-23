import subscribeToTransactions from './transactions'
import subscribeToInvoices from './invoices'

export default (mainWindow, lnd) => {
  subscribeToTransactions(mainWindow, lnd)
  subscribeToInvoices(mainWindow, lnd)
}

import subscribeToTransactions from './transactions'
import subscribeToInvoices from './invoices'
import subscribeToChannelGraph from './channelgraph'

export default (mainWindow, lnd) => {
  subscribeToTransactions(mainWindow, lnd)
  subscribeToInvoices(mainWindow, lnd)
  subscribeToChannelGraph(mainWindow, lnd)
}

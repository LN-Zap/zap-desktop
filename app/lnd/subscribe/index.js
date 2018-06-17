import subscribeToTransactions from './transactions'
import subscribeToInvoices from './invoices'
import subscribeToChannelGraph from './channelgraph'

export default (mainWindow, lnd, log) => {
  subscribeToTransactions(mainWindow, lnd, log)
  subscribeToInvoices(mainWindow, lnd, log)
  subscribeToChannelGraph(mainWindow, lnd)
}

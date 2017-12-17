import subscribeToTransactions from './transactions'
import subscribeToInvoices from './invoices'
import subscribeToChannelGraph from './channelgraph'

export default (mainWindow, lnd, meta) => {
  subscribeToTransactions(mainWindow, lnd, meta)
  subscribeToInvoices(mainWindow, lnd, meta)
  subscribeToChannelGraph(mainWindow, lnd, meta)
}

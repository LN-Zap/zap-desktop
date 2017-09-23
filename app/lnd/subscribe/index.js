import subscribeToTransactions from './transactions'

export default (mainWindow, lnd) => {
  subscribeToTransactions(mainWindow, lnd)
}
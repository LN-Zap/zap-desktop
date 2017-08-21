import createIpc from 'redux-electron-ipc'
import { receiveInfo } from './info'
import { receivePeers } from './peers'
import { receiveChannels } from './channels'
import { receivePayments } from './payment'
import { receiveInvoices, createdInvoice, receiveFormInvoice } from './invoice'
import { receiveBalance } from './balance'

// Import all receiving IPC event handlers and pass them into createIpc
const ipc = createIpc({
  'receiveInfo': receiveInfo,
  'receivePeers': receivePeers,
  'receiveChannels': receiveChannels,
  'receivePayments': receivePayments,
  'receiveInvoices': receiveInvoices,
  'receiveInvoice': receiveFormInvoice,
  'receiveBalance': receiveBalance,
  'createdInvoice': createdInvoice
})

export default ipc
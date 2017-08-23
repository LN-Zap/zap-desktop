import createIpc from 'redux-electron-ipc'
import { receiveInfo } from './info'
import { receivePeers, connectSuccess, disconnectSuccess } from './peers'
import {
  receiveChannels,
  channelSuccessful,
  pushchannelupdated,
  pushchannelend,
  pushchannelerror,
  pushchannelstatus
} from './channels'
import { receivePayments, paymentSuccessful } from './payment'
import { receiveInvoices, createdInvoice, receiveFormInvoice } from './invoice'
import { receiveBalance } from './balance'

// Import all receiving IPC event handlers and pass them into createIpc
const ipc = createIpc({
  receiveInfo,
  receivePeers,
  receiveChannels,
  receivePayments,
  receiveInvoices,
  receiveInvoice: receiveFormInvoice,
  receiveBalance,
  createdInvoice,
  paymentSuccessful,
  channelSuccessful,
  pushchannelupdated,
  pushchannelend,
  pushchannelerror,
  pushchannelstatus,
  connectSuccess,
  disconnectSuccess
})

export default ipc

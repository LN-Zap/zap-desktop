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
  'receiveInfo': receiveInfo,
  'receivePeers': receivePeers,
  'receiveChannels': receiveChannels,
  'receivePayments': receivePayments,
  'receiveInvoices': receiveInvoices,
  'receiveInvoice': receiveFormInvoice,
  'receiveBalance': receiveBalance,
  'createdInvoice': createdInvoice,
  'paymentSuccessful': paymentSuccessful,
  'channelSuccessful': channelSuccessful,
  'pushchannelupdated': pushchannelupdated,
  'pushchannelend': pushchannelend,
  'pushchannelerror': pushchannelerror,
  'pushchannelstatus': pushchannelstatus,
  'connectSuccess': connectSuccess,
  'disconnectSuccess': disconnectSuccess
})

export default ipc
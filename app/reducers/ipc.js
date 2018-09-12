import createIpc from 'redux-electron-ipc'
import {
  lndSyncStatus,
  currentBlockHeight,
  lndBlockHeight,
  lndCfilterHeight,
  lightningGrpcActive,
  walletUnlockerGrpcActive
} from './lnd'
import { receiveInfo } from './info'
import { receiveAddress } from './address'
import { receiveCryptocurrency } from './ticker'
import { receivePeers, connectSuccess, disconnectSuccess, connectFailure } from './peers'
import {
  receiveChannels,
  channelSuccessful,
  pushchannelupdated,
  pushchannelend,
  pushchannelerror,
  pushchannelstatus,
  closeChannelSuccessful,
  pushclosechannelupdated,
  pushclosechannelend,
  pushclosechannelerror,
  pushclosechannelstatus,
  channelGraphData,
  channelGraphStatus
} from './channels'
import { lightningPaymentUri } from './payform'
import { receivePayments, paymentSuccessful, paymentFailed } from './payment'
import {
  receiveInvoices,
  createdInvoice,
  receiveFormInvoice,
  invoiceUpdate,
  invoiceFailed
} from './invoice'
import { receiveBalance } from './balance'
import {
  receiveTransactions,
  transactionSuccessful,
  transactionError,
  newTransaction
} from './transaction'

import { receiveDescribeNetwork, receiveQueryRoutes, receiveInvoiceAndQueryRoutes } from './network'

import {
  startOnboarding,
  startLndError,
  receiveSeed,
  receiveSeedError,
  walletCreated,
  walletUnlocked,
  walletConnected,
  unlockWalletError
} from './onboarding'

// Import all receiving IPC event handlers and pass them into createIpc
const ipc = createIpc({
  lndSyncStatus,
  currentBlockHeight,
  lndBlockHeight,
  lndCfilterHeight,
  lightningGrpcActive,

  receiveInfo,

  receivePeers,

  receiveChannels,

  receivePayments,

  receiveInvoices,
  receiveInvoice: receiveFormInvoice,
  createdInvoice,
  invoiceFailed,
  invoiceUpdate,

  receiveBalance,

  lightningPaymentUri,

  paymentSuccessful,
  paymentFailed,

  channelSuccessful,
  pushchannelupdated,
  pushchannelend,
  pushchannelerror,
  pushchannelstatus,
  closeChannelSuccessful,
  pushclosechannelupdated,
  pushclosechannelend,
  pushclosechannelerror,
  pushclosechannelstatus,
  channelGraphData,
  channelGraphStatus,

  connectSuccess,
  connectFailure,
  disconnectSuccess,

  receiveAddress,
  receiveCryptocurrency,

  receiveTransactions,
  transactionSuccessful,
  transactionError,
  newTransaction,

  receiveDescribeNetwork,
  receiveQueryRoutes,
  receiveInvoiceAndQueryRoutes,

  startOnboarding,
  startLndError,
  walletUnlockerGrpcActive,
  receiveSeed,
  receiveSeedError,
  walletCreated,
  walletUnlocked,
  walletConnected,
  unlockWalletError
})

export default ipc

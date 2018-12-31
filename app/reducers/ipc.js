import createIpc from 'redux-electron-ipc'
import { receiveLocale } from './locale'
import {
  currentBlockHeight,
  fetchSeedSuccess,
  fetchSeedError,
  lightningGrpcActive,
  lndSyncStatus,
  lndStopped,
  lndStarted,
  lndBlockHeight,
  lndCfilterHeight,
  setUnlockWalletError,
  startLndError,
  walletCreated,
  walletUnlocked,
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
import { lightningPaymentUri, queryRoutesSuccess, queryRoutesFailure } from './pay'
import { receivePayments, paymentSuccessful, paymentFailed } from './payment'
import { receiveInvoices, createdInvoice, invoiceUpdate, invoiceFailed } from './invoice'
import { receiveBalance } from './balance'
import {
  receiveTransactions,
  transactionSuccessful,
  transactionFailed,
  newTransaction
} from './transaction'

import { receiveDescribeNetwork, receiveQueryRoutes, receiveInvoiceAndQueryRoutes } from './network'

import { lndconnectUri, startOnboarding } from './onboarding'

// Import all receiving IPC event handlers and pass them into createIpc
const ipc = createIpc({
  receiveLocale,
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
  createdInvoice,
  invoiceFailed,
  invoiceUpdate,

  receiveBalance,

  lightningPaymentUri,

  queryRoutesSuccess,
  queryRoutesFailure,

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
  transactionFailed,
  newTransaction,

  receiveDescribeNetwork,
  receiveQueryRoutes,
  receiveInvoiceAndQueryRoutes,

  lndconnectUri,
  startOnboarding,
  startLndError,
  lndStopped,
  lndStarted,
  walletUnlockerGrpcActive,
  fetchSeedSuccess,
  fetchSeedError,
  walletCreated,
  walletUnlocked,
  setUnlockWalletError
})

export default ipc

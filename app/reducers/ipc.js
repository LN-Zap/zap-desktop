import createIpc from 'redux-electron-ipc'
import { receiveLocale } from './locale'
import { receiveError } from './notification'
import {
  currentBlockHeight,
  fetchSeedSuccess,
  fetchSeedError,
  lightningWalletStarted,
  lndSyncStatus,
  lndStopped,
  lndStarted,
  lndBlockHeight,
  lndCfilterHeight,
  setUnlockWalletError,
  startLndError,
  walletCreated,
  walletUnlocked,
  walletUnlockerStarted,
  startNeutrino,
  startWalletUnlocker,
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
  channelGraphStatus,
} from './channels'
import { lightningPaymentUri, queryRoutesSuccess, queryRoutesFailure } from './pay'
import { receivePayments, paymentSuccessful, paymentFailed } from './payment'
import { receiveInvoices, createdInvoice, invoiceUpdate, invoiceFailed } from './invoice'
import { receiveBalance } from './balance'
import {
  receiveTransactions,
  transactionSuccessful,
  transactionFailed,
  newTransaction,
} from './transaction'

import { receiveDescribeNetwork } from './network'

import { lndconnectUri, startOnboarding } from './onboarding'

// Import all receiving IPC event handlers and pass them into createIpc
const ipc = createIpc({
  receiveLocale,
  receiveError,
  lndSyncStatus,
  currentBlockHeight,
  lndBlockHeight,
  lndCfilterHeight,
  lightningWalletStarted,
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

  lndconnectUri,
  startOnboarding,
  startLndError,
  lndStopped,
  lndStarted,
  walletUnlockerStarted,
  fetchSeedSuccess,
  fetchSeedError,
  walletCreated,
  walletUnlocked,
  setUnlockWalletError,

  startNeutrino,
  startWalletUnlocker,
})

export default ipc

import createIpc from 'redux-electron-ipc'
import { receiveLocale } from './locale'
import {
  currentBlockHeight,
  fetchSeedSuccess,
  fetchSeedError,
  lightningWalletStarted,
  lndSyncStatus,
  lndStarted,
  lndStopped,
  lndCrashed,
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
import {
  bitcoinPaymentUri,
  lightningPaymentUri,
  queryRoutesSuccess,
  queryRoutesFailure,
} from './pay'
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

  bitcoinPaymentUri,
  lightningPaymentUri,

  queryRoutesSuccess,
  queryRoutesFailure,

  paymentSuccessful,
  paymentFailed,

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
  lndStarted,
  lndStopped,
  lndCrashed,
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

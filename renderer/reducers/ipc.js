import createIpc from 'redux-electron-ipc'

import { saveInvoiceFailure, saveInvoiceSuccess } from './activity'
import { initApp, terminateApp, openPreferences } from './app'
import {
  backupTokensUpdated,
  saveBackupSuccess,
  backupServiceInitialized,
  queryWalletBackupSuccess,
  queryWalletBackupFailure,
} from './backup'
import {
  lnurlError,
  lnurlAuthRequest,
  lnurlAuthSuccess,
  lnurlAuthError,
  lnurlChannelRequest,
  lnurlChannelSuccess,
  lnurlChannelError,
  lnurlWithdrawRequest,
  lnurlWithdrawSuccess,
  lnurlWithdrawError,
} from './lnurl'
import { receiveLocale } from './locale'
import { killNeutrino } from './neutrino'
import { lndconnectUri } from './onboarding'
import { bitcoinPaymentUri, lightningPaymentUri } from './pay'

const ipc = createIpc({
  initApp,
  terminateApp,
  killNeutrino,
  receiveLocale,
  openPreferences,
  bitcoinPaymentUri,
  lightningPaymentUri,
  lndconnectUri,
  lnurlError,
  saveBackupSuccess,
  backupTokensUpdated,
  backupServiceInitialized,
  queryWalletBackupSuccess,
  queryWalletBackupFailure,
  saveInvoiceSuccess,
  saveInvoiceFailure,
  lnurlAuthRequest,
  lnurlAuthSuccess,
  lnurlAuthError,
  lnurlChannelRequest,
  lnurlChannelSuccess,
  lnurlChannelError,
  lnurlWithdrawRequest,
  lnurlWithdrawSuccess,
  lnurlWithdrawError,
})

export default ipc

import createIpc from 'redux-electron-ipc'
import { initApp, terminateApp, openPreferences, lnurlError } from './app'
import { killNeutrino } from './neutrino'
import { receiveLocale } from './locale'
import { lnurlChannelRequest, lnurlChannelSuccess, lnurlChannelError } from './channels'
import {
  bitcoinPaymentUri,
  lightningPaymentUri,
  lnurlWithdrawRequest,
  lnurlWithdrawSuccess,
  lnurlWithdrawError,
} from './pay'
import { lndconnectUri } from './onboarding'
import { saveInvoiceFailure, saveInvoiceSuccess } from './activity'
import {
  backupTokensUpdated,
  saveBackupSuccess,
  backupServiceInitialized,
  queryWalletBackupSuccess,
  queryWalletBackupFailure,
} from './backup'

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
  lnurlChannelRequest,
  lnurlChannelSuccess,
  lnurlChannelError,
  lnurlWithdrawRequest,
  lnurlWithdrawSuccess,
  lnurlWithdrawError,
})

export default ipc

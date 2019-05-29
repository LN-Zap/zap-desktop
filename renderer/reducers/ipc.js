import createIpc from 'redux-electron-ipc'
import { initApp, terminateApp, openPreferences } from './app'
import { killNeutrino } from './neutrino'
import { receiveLocale } from './locale'

import { bitcoinPaymentUri, lightningPaymentUri } from './pay'
import { lndconnectUri } from './onboarding'
import { backupTokensUpdated, saveBackupSuccess, backupServiceInitialized } from './backup'

const ipc = createIpc({
  initApp,
  terminateApp,
  killNeutrino,
  receiveLocale,
  openPreferences,
  bitcoinPaymentUri,
  lightningPaymentUri,
  lndconnectUri,
  saveBackupSuccess,
  backupTokensUpdated,
  backupServiceInitialized,
})

export default ipc

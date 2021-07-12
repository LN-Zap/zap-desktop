import React from 'react'

import { connect } from 'react-redux'

import AppErrorBoundary from 'components/ErrorBoundary/AppErrorBoundary'
import Home from 'components/Home'
import { resetApp } from 'reducers/app'
import {
  setUnlockWalletError,
  stopLnd,
  startLnd,
  unlockWallet,
  generateLndConfigFromWallet,
  clearStartLndError,
} from 'reducers/lnd'
import { openDialog } from 'reducers/modal'
import { neutrinoSelectors } from 'reducers/neutrino'
import { showError, showNotification } from 'reducers/notification'
import {
  setActiveWallet,
  walletSelectors,
  setIsWalletOpen,
  putWallet,
  DELETE_WALLET_DIALOG_ID,
} from 'reducers/wallet'

import DeleteWalletDialog from './DeleteWalletDialog'

const deleteWallet = openDialog.bind(null, DELETE_WALLET_DIALOG_ID)

const HomeWrapper = props => (
  <>
    <Home {...props} />
    <DeleteWalletDialog />
  </>
)

const mapStateToProps = state => ({
  lndConnect: state.onboarding.lndConnect,
  wallets: state.wallet.wallets,
  activeWallet: walletSelectors.activeWallet(state),
  activeWalletSettings: walletSelectors.activeWalletSettings(state),
  isNeutrinoRunning: neutrinoSelectors.isNeutrinoRunning(state),
  isLightningGrpcActive: state.lnd.isLightningGrpcActive,
  isWalletUnlockerGrpcActive: state.lnd.isWalletUnlockerGrpcActive,
  startLndError: state.lnd.startLndError,
  isStartingLnd: state.lnd.isStartingLnd,
  isUnlockingWallet: state.lnd.isUnlockingWallet,
  unlockWalletError: state.lnd.unlockWalletError,
})

const mapDispatchToProps = {
  setActiveWallet,
  setUnlockWalletError,
  clearStartLndError,
  stopLnd,
  putWallet,
  resetApp,
  showNotification,
  startLnd,
  unlockWallet,
  deleteWallet,
  setIsWalletOpen,
  showError,
  generateLndConfigFromWallet,
}

const ConnectedHome = connect(mapStateToProps, mapDispatchToProps)(HomeWrapper)

const HomeWithErrorBoundaries = props => (
  <AppErrorBoundary>
    <ConnectedHome {...props} />
  </AppErrorBoundary>
)

export default HomeWithErrorBoundaries

import React from 'react'
import { connect } from 'react-redux'
import {
  setActiveWallet,
  walletSelectors,
  showDeleteWalletDialog,
  setIsWalletOpen,
  putWallet,
} from 'reducers/wallet'
import {
  setUnlockWalletError,
  stopLnd,
  startLnd,
  unlockWallet,
  refreshLndConnectURI,
  clearStartLndError,
} from 'reducers/lnd'
import { showError, showNotification } from 'reducers/notification'
import Home from 'components/Home'
import DeleteWalletDialog from './Home/DeleteWalletDialog'

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
  showNotification,
  startLnd,
  unlockWallet,
  deleteWallet: showDeleteWalletDialog,
  setIsWalletOpen,
  showError,
  refreshLndConnectURI,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeWrapper)

import React from 'react'
import { connect } from 'react-redux'
import {
  setActiveWallet,
  walletSelectors,
  setIsWalletOpen,
  showDeleteWalletDialog
} from 'reducers/wallet'
import {
  setUnlockWalletError,
  stopLnd,
  startLnd,
  unlockWallet,
  setStartLndError
} from 'reducers/lnd'
import { showError } from 'reducers/notification'
import { Home } from 'components/Home'
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
  lightningGrpcActive: state.lnd.lightningGrpcActive,
  walletUnlockerGrpcActive: state.lnd.walletUnlockerGrpcActive,
  startLndError: state.lnd.startLndError,
  unlockingWallet: state.lnd.unlockingWallet,
  unlockWalletError: state.lnd.unlockWalletError
})

const mapDispatchToProps = {
  setActiveWallet,
  setUnlockWalletError,
  setStartLndError,
  stopLnd,
  startLnd,
  unlockWallet,
  deleteWallet: showDeleteWalletDialog,
  setIsWalletOpen,
  showError
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeWrapper)

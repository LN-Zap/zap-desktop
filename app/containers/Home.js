import { connect } from 'react-redux'
import { setActiveWallet, walletSelectors, deleteWallet } from 'reducers/wallet'
import { setUnlockWalletError, stopLnd, startLnd, unlockWallet } from 'reducers/lnd'
import { Home } from 'components/Home'

const mapStateToProps = state => ({
  lndConnect: state.onboarding.lndConnect,
  wallets: state.wallet.wallets,
  activeWallet: walletSelectors.activeWallet(state),
  activeWalletSettings: walletSelectors.activeWalletSettings(state),
  lightningGrpcActive: state.lnd.lightningGrpcActive,
  walletUnlockerGrpcActive: state.lnd.walletUnlockerGrpcActive,
  unlockingWallet: state.lnd.unlockingWallet,
  unlockWalletError: state.lnd.unlockWalletError
})

const mapDispatchToProps = {
  setActiveWallet,
  setUnlockWalletError,
  stopLnd,
  startLnd,
  unlockWallet,
  deleteWallet
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)

import { connect } from 'react-redux'
import { Login } from 'components/Onboarding/Steps'
import { setUnlockWalletError, unlockWallet } from 'reducers/lnd'

const mapStateToProps = state => ({
  unlockWalletError: state.lnd.unlockWalletError,
  isSkipBackupDialogOpen: state.onboarding.isSkipBackupDialogOpen,
})

const mapDispatchToProps = {
  setUnlockWalletError,
  unlockWallet,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login)

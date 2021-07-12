import { connect } from 'react-redux'

import { Login } from 'components/Onboarding/Steps'
import { setUnlockWalletError, unlockWallet } from 'reducers/lnd'

const mapStateToProps = state => ({
  unlockWalletError: state.lnd.unlockWalletError,
})

const mapDispatchToProps = {
  setUnlockWalletError,
  unlockWallet,
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)

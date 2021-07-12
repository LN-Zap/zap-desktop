import { connect } from 'react-redux'

import { WalletRecover } from 'components/Onboarding/Steps'
import { createWallet, clearCreateWalletError } from 'reducers/lnd'
import { setPassphrase } from 'reducers/onboarding'

const mapStateToProps = state => ({
  createWalletError: state.lnd.createWalletError,
  isCreatingWallet: state.lnd.isCreatingWallet,
  passphrase: state.onboarding.passphrase,
})

const mapDispatchToProps = {
  createWallet,
  clearCreateWalletError,
  setPassphrase,
}

export default connect(mapStateToProps, mapDispatchToProps)(WalletRecover)

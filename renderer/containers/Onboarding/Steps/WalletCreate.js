import { connect } from 'react-redux'

import { WalletCreate } from 'components/Onboarding/Steps'
import { createWallet, clearCreateWalletError } from 'reducers/lnd'

const mapStateToProps = state => ({
  createWalletError: state.lnd.createWalletError,
  isCreatingWallet: state.lnd.isCreatingWallet,
})

const mapDispatchToProps = {
  createWallet,
  clearCreateWalletError,
}

export default connect(mapStateToProps, mapDispatchToProps)(WalletCreate)

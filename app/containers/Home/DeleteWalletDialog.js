import { connect } from 'react-redux'

import { DeleteWalletDialog } from 'components/Home'
import { hideDeleteWalletDialog, deleteWallet, walletSelectors } from 'reducers/wallet'

const mapStateToProps = state => {
  const isOpen = Boolean(state.wallet.isDeleteDialogOpen)
  return {
    isOpen,
    walletDir: isOpen ? walletSelectors.activeWalletDir(state) : ''
  }
}

const mapDispatchToProps = dispatch => ({
  onDelete() {
    dispatch(deleteWallet())
  },

  onCancel() {
    dispatch(hideDeleteWalletDialog())
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeleteWalletDialog)

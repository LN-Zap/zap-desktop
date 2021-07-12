import { connect } from 'react-redux'

import { DeleteWalletDialog } from 'components/Home'
import { modalSelectors, closeDialog } from 'reducers/modal'
import { deleteWallet, walletSelectors, DELETE_WALLET_DIALOG_ID } from 'reducers/wallet'

const onCancel = closeDialog.bind(null, DELETE_WALLET_DIALOG_ID)
const onDelete = deleteWallet

const mapStateToProps = state => {
  const isOpen = modalSelectors.isDialogOpen(state, DELETE_WALLET_DIALOG_ID)
  return {
    isOpen,
    walletDir: isOpen ? walletSelectors.activeWalletDir(state) : '',
  }
}

const mapDispatchToProps = {
  onDelete,
  onCancel,
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteWalletDialog)

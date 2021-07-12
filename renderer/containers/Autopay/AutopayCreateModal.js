import { connect } from 'react-redux'

import AutopayCreateModal from 'components/Autopay/AutopayCreateModal'
import {
  closeAutopayCreateModal,
  autopaySelectors,
  enableAutopay,
  disableAutopay,
} from 'reducers/autopay'
import { showNotification, showError } from 'reducers/notification'

const mapStateToProps = state => ({
  selectedMerchant: autopaySelectors.selectedMerchant(state),
  isEditMode: autopaySelectors.isCreateModalEditMode(state),
})

const mapDispatchToProps = dispatch => ({
  onClose() {
    dispatch(closeAutopayCreateModal())
  },

  onCreateAutopay(pubkey, limit) {
    dispatch(enableAutopay(pubkey, limit))
  },

  onRemoveAutopay(pubkey) {
    dispatch(disableAutopay(pubkey))
  },

  showNotification(...args) {
    dispatch(showNotification(...args))
  },

  showError(...args) {
    dispatch(showError(...args))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(AutopayCreateModal)

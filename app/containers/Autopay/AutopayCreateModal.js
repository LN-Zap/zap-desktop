import { connect } from 'react-redux'
import AutopayCreateModal from 'components/Autopay/AutopayCreateModal'
import { closeAutopayCreateModal, autopaySelectors, enableAutopay } from 'reducers/autopay'
import { showNotification, showError } from 'reducers/notification'

const mapStateToProps = state => {
  const selectedMerchant = autopaySelectors.selectedMerchant(state)
  return {
    selectedMerchant,
  }
}
const mapDispatchToProps = dispatch => ({
  onClose() {
    dispatch(closeAutopayCreateModal())
  },

  onCreateAutopay(pubkey, limit) {
    dispatch(enableAutopay(pubkey, limit))
  },

  showNotification(...args) {
    dispatch(showNotification(...args))
  },

  showError(...args) {
    dispatch(showError(...args))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AutopayCreateModal)

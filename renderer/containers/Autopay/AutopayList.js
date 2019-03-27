import { connect } from 'react-redux'
import AutopayList from 'components/Autopay/AutopayList'
import { openAutopayCreateModal, autopaySelectors } from 'reducers/autopay'

const mapStateToProps = state => ({
  merchants: autopaySelectors.filteredMerchants(state),
})

const mapDispatchToProps = {
  openAutopayCreateModal,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AutopayList)

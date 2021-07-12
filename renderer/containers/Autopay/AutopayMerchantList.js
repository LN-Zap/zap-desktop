import { connect } from 'react-redux'

import AutopayMerchantList from 'components/Autopay/AutopayMerchantList'
import { openAutopayCreateModal, autopaySelectors } from 'reducers/autopay'

const mapStateToProps = state => ({
  merchants: autopaySelectors.filteredMerchants(state),
})

const mapDispatchToProps = {
  openAutopayCreateModal,
}

export default connect(mapStateToProps, mapDispatchToProps)(AutopayMerchantList)

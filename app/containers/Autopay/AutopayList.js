import { connect } from 'react-redux'
import AutopayList from 'components/Autopay/AutopayList'
import { autopaySelectors } from 'reducers/autopay'

const mapStateToProps = state => ({
  merchants: autopaySelectors.filteredMerchants(state),
})

export default connect(
  mapStateToProps,
  null
)(AutopayList)

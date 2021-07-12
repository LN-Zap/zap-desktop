import { connect } from 'react-redux'

import AutopayList from 'components/Autopay/AutopayList'
import { openAutopayCreateModal, autopaySelectors } from 'reducers/autopay'

const mapStateToProps = state => ({
  merchants: autopaySelectors.autopayListAsArray(state),
})

const mapDispatchToProps = dispatch => {
  return {
    openAutopayCreateModal(merchantId) {
      dispatch(openAutopayCreateModal(merchantId, true))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AutopayList)

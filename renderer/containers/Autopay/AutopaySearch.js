import { connect } from 'react-redux'

import AutopaySearch from 'components/Autopay/AutopaySearch'
import { updateAutopaySearchQuery, autopaySelectors } from 'reducers/autopay'

const mapStateToProps = state => ({
  searchQuery: autopaySelectors.searchQuery(state),
})

const mapDispatchToProps = {
  updateAutopaySearchQuery,
}

export default connect(mapStateToProps, mapDispatchToProps)(AutopaySearch)

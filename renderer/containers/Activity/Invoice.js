import { connect } from 'react-redux'

import Invoice from 'components/Activity/Invoice'
import { showActivityModal } from 'reducers/activity'
import { tickerSelectors } from 'reducers/ticker'

const mapDispatchToProps = {
  showActivityModal,
}

const mapStateToProps = state => ({
  cryptoUnitName: tickerSelectors.cryptoUnitName(state),
})

export default connect(mapStateToProps, mapDispatchToProps)(Invoice)

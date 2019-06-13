import { connect } from 'react-redux'
import { tickerSelectors } from 'reducers/ticker'
import { showActivityModal } from 'reducers/activity'
import { networkSelectors } from 'reducers/network'

import Payment from 'components/Activity/Payment'

const mapDispatchToProps = {
  showActivityModal,
}

const mapStateToProps = state => ({
  cryptoUnitName: tickerSelectors.cryptoUnitName(state),
  nodes: networkSelectors.nodes(state),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Payment)

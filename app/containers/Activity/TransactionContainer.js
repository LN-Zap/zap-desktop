import { connect } from 'react-redux'
import { tickerSelectors } from 'reducers/ticker'
import { showActivityModal } from 'reducers/activity'

import Transaction from 'components/Activity/Transaction'

const mapDispatchToProps = {
  showActivityModal
}

const mapStateToProps = state => ({
  currencyName: tickerSelectors.currencyName(state),
  currentTicker: tickerSelectors.currentTicker(state),
  nodes: state.network.nodes,
  ticker: state.ticker
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Transaction)

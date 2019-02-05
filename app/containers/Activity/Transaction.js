import { connect } from 'react-redux'
import { tickerSelectors } from 'reducers/ticker'
import { showActivityModal } from 'reducers/activity'

import Transaction from 'components/Activity/Transaction'

const mapDispatchToProps = {
  showActivityModal
}

const mapStateToProps = state => ({
  currencyName: tickerSelectors.currencyName(state),
  nodes: state.network.nodes
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Transaction)

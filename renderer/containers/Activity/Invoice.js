import { connect } from 'react-redux'
import { tickerSelectors } from 'reducers/ticker'
import { showActivityModal } from 'reducers/activity'

import Invoice from 'components/Activity/Invoice'

const mapDispatchToProps = {
  showActivityModal,
}

const mapStateToProps = state => ({
  cryptoName: tickerSelectors.cryptoName(state),
  nodes: state.network.nodes,
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Invoice)

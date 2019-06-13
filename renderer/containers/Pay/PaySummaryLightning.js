import { connect } from 'react-redux'
import PaySummaryLightning from 'components/Pay/PaySummaryLightning'
import { tickerSelectors } from 'reducers/ticker'
import { networkSelectors } from 'reducers/network'

const mapStateToProps = state => ({
  cryptoUnitName: tickerSelectors.cryptoUnitName(state),
  isQueryingRoutes: state.pay.isQueryingRoutes,
  nodes: networkSelectors.nodes(state),
})

export default connect(mapStateToProps)(PaySummaryLightning)

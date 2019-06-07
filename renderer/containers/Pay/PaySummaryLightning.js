import { connect } from 'react-redux'
import PaySummaryLightning from 'components/Pay/PaySummaryLightning'
import { tickerSelectors } from 'reducers/ticker'

const mapStateToProps = state => ({
  cryptoCurrencyTicker: tickerSelectors.cryptoName(state),
  isQueryingRoutes: state.pay.isQueryingRoutes,
  nodes: state.network.nodes,
})

export default connect(mapStateToProps)(PaySummaryLightning)

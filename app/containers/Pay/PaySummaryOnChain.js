import { connect } from 'react-redux'
import PaySummaryOnChain from 'components/Pay/PaySummaryOnChain'
import { tickerSelectors } from 'reducers/ticker'
import { queryFees } from 'reducers/pay'

const mapStateToProps = state => ({
  cryptoCurrencyTicker: tickerSelectors.currencyName(state),
  isQueryingFees: state.pay.isQueryingFees,
  nodes: state.network.nodes,
  onchainFees: state.pay.onchainFees
})

const mapDispatchToProps = {
  queryFees
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaySummaryOnChain)

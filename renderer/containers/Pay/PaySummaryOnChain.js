import { connect } from 'react-redux'
import PaySummaryOnChain from 'components/Pay/PaySummaryOnChain'
import { tickerSelectors } from 'reducers/ticker'
import { queryFees } from 'reducers/pay'
import { networkSelectors } from 'reducers/network'

const mapStateToProps = state => ({
  cryptoUnitName: tickerSelectors.cryptoUnitName(state),
  isQueryingFees: state.pay.isQueryingFees,
  nodes: networkSelectors.nodes(state),
  onchainFees: state.pay.onchainFees,
})

const mapDispatchToProps = {
  queryFees,
}

export default connect(mapStateToProps, mapDispatchToProps)(PaySummaryOnChain)

import { connect } from 'react-redux'

import PaySummaryOnChain from 'components/Pay/PaySummaryOnChain'
import { networkSelectors } from 'reducers/network'
import { queryFees, paySelectors } from 'reducers/pay'
import { tickerSelectors } from 'reducers/ticker'

const mapStateToProps = state => ({
  cryptoUnitName: tickerSelectors.cryptoUnitName(state),
  isQueryingFees: paySelectors.isQueryingFees(state),
  nodes: networkSelectors.nodes(state),
  onchainFees: paySelectors.onchainFees(state),
})

const mapDispatchToProps = {
  queryFees,
}

export default connect(mapStateToProps, mapDispatchToProps)(PaySummaryOnChain)

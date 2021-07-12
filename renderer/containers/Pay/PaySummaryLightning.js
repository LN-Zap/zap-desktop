import { connect } from 'react-redux'

import PaySummaryLightning from 'components/Pay/PaySummaryLightning'
import { openModal } from 'reducers/modal'
import { networkSelectors } from 'reducers/network'
import { paySelectors } from 'reducers/pay'
import { settingsSelectors } from 'reducers/settings'
import { tickerSelectors } from 'reducers/ticker'

const mapStateToProps = state => ({
  cryptoUnitName: tickerSelectors.cryptoUnitName(state),
  isQueryingRoutes: paySelectors.isQueryingRoutes(state),
  nodes: networkSelectors.nodes(state),
  feeLimit: settingsSelectors.currentConfig(state).payments.feeLimit,
})

const mapDispatchToProps = {
  openModal,
}

export default connect(mapStateToProps, mapDispatchToProps)(PaySummaryLightning)

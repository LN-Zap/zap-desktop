import { connect } from 'react-redux'
import { Pay } from 'components/Pay'
import { fetchTickers, tickerSelectors } from 'reducers/ticker'
import { setRedirectPayReq, queryFees, queryRoutes, paySelectors } from 'reducers/pay'
import { balanceSelectors } from 'reducers/balance'
import { addFilter } from 'reducers/activity'
import { channelsSelectors } from 'reducers/channels'
import { sendCoins } from 'reducers/transaction'
import { payInvoice } from 'reducers/payment'
import { closeModal } from 'reducers/modal'
import { settingsSelectors } from 'reducers/settings'
import { infoSelectors } from 'reducers/info'

const mapStateToProps = state => ({
  chain: state.info.chain,
  network: state.info.network,
  chainName: infoSelectors.chainName(state),
  channelBalance: balanceSelectors.channelBalance(state),
  cryptoUnit: tickerSelectors.cryptoUnit(state),
  cryptoUnitName: tickerSelectors.cryptoUnitName(state),
  isQueryingFees: paySelectors.isQueryingFees(state),
  lndTargetConfirmations: settingsSelectors.currentConfig(state).lndTargetConfirmations,
  redirectPayReq: paySelectors.redirectPayReq(state),
  onchainFees: paySelectors.onchainFees(state),
  routes: paySelectors.routes(state),
  maxOneTimeSend: channelsSelectors.maxOneTimeSend(state),
  walletBalanceConfirmed: balanceSelectors.walletBalanceConfirmed(state),
})

const mapDispatchToProps = {
  addFilter,
  closeModal,
  fetchTickers,
  payInvoice,
  setRedirectPayReq,
  sendCoins,
  queryFees,
  queryRoutes,
}

export default connect(mapStateToProps, mapDispatchToProps)(Pay)

import { connect } from 'react-redux'
import { Pay } from 'components/Pay'
import { fetchTickers, tickerSelectors } from 'reducers/ticker'
import { setPayReq, queryFees, queryRoutes } from 'reducers/pay'
import { balanceSelectors } from 'reducers/balance'
import { changeFilter } from 'reducers/activity'
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
  cryptoCurrency: tickerSelectors.cryptoUnit(state),
  cryptoCurrencyTicker: tickerSelectors.cryptoName(state),
  isQueryingFees: state.pay.isQueryingFees,
  lndTargetConfirmations: settingsSelectors.currentConfig(state).lndTargetConfirmations,
  payReq: state.pay.payReq,
  onchainFees: state.pay.onchainFees,
  routes: state.pay.routes,
  walletBalanceConfirmed: balanceSelectors.walletBalanceConfirmed(state),
})

const mapDispatchToProps = {
  changeFilter,
  closeModal,
  fetchTickers,
  payInvoice,
  setPayReq,
  sendCoins,
  queryFees,
  queryRoutes,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Pay)

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

const mapStateToProps = state => ({
  chain: state.info.chain,
  network: state.info.network,
  cryptoName: tickerSelectors.cryptoName(state),
  channelBalance: balanceSelectors.channelBalance(state),
  cryptoCurrency: state.ticker.currency,
  cryptoCurrencyTicker: tickerSelectors.currencyName(state),
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

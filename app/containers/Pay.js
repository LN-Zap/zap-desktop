import { connect } from 'react-redux'
import { Pay } from 'components/Pay'
import { tickerSelectors, setCurrency, setFiatTicker } from 'reducers/ticker'
import { setPayReq, queryFees, queryRoutes } from 'reducers/pay'
import { infoSelectors } from 'reducers/info'
import { sendCoins } from 'reducers/transaction'
import { payInvoice } from 'reducers/payment'

const mapStateToProps = state => ({
  chain: state.info.chain,
  network: infoSelectors.testnetSelector(state) ? 'testnet' : 'mainnet',
  cryptoName: tickerSelectors.cryptoName(state),
  channelBalance: state.balance.channelBalance,
  currentTicker: tickerSelectors.currentTicker(state),
  cryptoCurrency: state.ticker.currency,
  cryptoCurrencyTicker: tickerSelectors.currencyName(state),
  cryptoCurrencies: tickerSelectors.currencyFilters(state),
  fiatCurrencies: state.ticker.fiatTickers,
  fiatCurrency: state.ticker.fiatTicker,
  payReq: state.pay.payReq,
  isQueryingFees: state.pay.isQueryingFees,
  isQueryingRoutes: state.pay.isQueryingRoutes,
  nodes: state.network.nodes,
  onchainFees: state.pay.onchainFees,
  routes: state.pay.routes,
  walletBalance: state.balance.walletBalance
})

const mapDispatchToProps = {
  payInvoice,
  setCryptoCurrency: setCurrency,
  setFiatCurrency: setFiatTicker,
  setPayReq,
  sendCoins,
  queryFees,
  queryRoutes
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Pay)

import { connect } from 'react-redux'
import { Pay } from 'components/Pay'
import { tickerSelectors } from 'reducers/ticker'
import { setPayReq, queryRoutes } from 'reducers/pay'
import { sendCoins } from 'reducers/transaction'
import { payInvoice } from 'reducers/payment'

const mapStateToProps = state => ({
  chain: state.info.chain,
  network: state.info.network,
  cryptoName: tickerSelectors.cryptoName(state),
  channelBalance: state.balance.channelBalance,
  cryptoCurrency: state.ticker.currency,
  cryptoCurrencyTicker: tickerSelectors.currencyName(state),
  payReq: state.pay.payReq,
  onchainFees: state.pay.onchainFees,
  routes: state.pay.routes,
  walletBalance: state.balance.walletBalance
})

const mapDispatchToProps = {
  payInvoice,
  setPayReq,
  sendCoins,
  queryRoutes
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Pay)

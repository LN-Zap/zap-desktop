import { connect } from 'react-redux'
import { Pay } from 'components/Pay'
import { tickerSelectors } from 'reducers/ticker'
import { setPayReq, queryFees, queryRoutes } from 'reducers/pay'
import { changeFilter } from 'reducers/activity'
import { sendCoins } from 'reducers/transaction'
import { payInvoice } from 'reducers/payment'
import { closeModal } from 'reducers/modal'

const mapStateToProps = state => ({
  chain: state.info.chain,
  network: state.info.network,
  cryptoName: tickerSelectors.cryptoName(state),
  channelBalance: state.balance.channelBalance,
  cryptoCurrency: state.ticker.currency,
  cryptoCurrencyTicker: tickerSelectors.currencyName(state),
  isQueryingFees: state.pay.isQueryingFees,
  payReq: state.pay.payReq,
  onchainFees: state.pay.onchainFees,
  routes: state.pay.routes,
  walletBalance: state.balance.walletBalance,
})

const mapDispatchToProps = {
  changeFilter,
  closeModal,
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

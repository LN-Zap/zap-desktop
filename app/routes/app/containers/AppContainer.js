import { connect } from 'react-redux'
import App from '../components/App'
import { fetchTicker, setCurrency, tickerSelectors } from '../../../reducers/ticker'
import { fetchBalance } from '../../../reducers/balance'
import { fetchInfo } from '../../../reducers/info'
import { createInvoice, fetchInvoice } from '../../../reducers/invoice'
import { payInvoice, sendCoins } from '../../../reducers/payment'
import { fetchChannels } from '../../../reducers/channels'
import {
  setForm,
  setPaymentType,
  setAmount,
  setOnchainAmount,
  setMessage,
  setPubkey,
  setPaymentRequest,
  formSelectors
} from '../../../reducers/form'

const mapDispatchToProps = {
  fetchTicker,
  setCurrency,
  fetchBalance,
  fetchInfo,
  setAmount,
  setOnchainAmount,
  setMessage,
  setPubkey,
  setPaymentRequest,
  setForm,
  setPaymentType,
  createInvoice,
  payInvoice,
  sendCoins,
  fetchChannels,
  fetchInvoice
}

const mapStateToProps = state => ({
  ticker: state.ticker,
  balance: state.balance,
  payment: state.payment,
  form: state.form,
  invoice: state.invoice,

  currentTicker: tickerSelectors.currentTicker(state),
  isOnchain: formSelectors.isOnchain(state),
  isLn: formSelectors.isLn(state)
})

export default connect(mapStateToProps, mapDispatchToProps)(App)

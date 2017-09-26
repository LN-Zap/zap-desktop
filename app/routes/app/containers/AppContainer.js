import { connect } from 'react-redux'
import { fetchTicker, setCurrency, tickerSelectors } from 'reducers/ticker'
import { fetchBalance } from 'reducers/balance'
import { fetchInfo } from 'reducers/info'
import { createInvoice, fetchInvoice } from 'reducers/invoice'
import { hideModal } from 'reducers/modal'
import { payInvoice } from 'reducers/payment'
import { sendCoins } from 'reducers/transaction'
import { fetchChannels } from 'reducers/channels'
import {
  setForm,
  setPaymentType,
  setAmount,
  setOnchainAmount,
  setMessage,
  setPubkey,
  setPaymentRequest,
  formSelectors
} from 'reducers/form'
import App from '../components/App'

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
  hideModal,
  payInvoice,
  sendCoins,
  fetchChannels,
  fetchInvoice
}

const mapStateToProps = state => ({
  ticker: state.ticker,
  balance: state.balance,
  payment: state.payment,
  transaction: state.transaction,
  form: state.form,
  invoice: state.invoice,
  modal: state.modal,

  currentTicker: tickerSelectors.currentTicker(state),
  isOnchain: formSelectors.isOnchain(state),
  isLn: formSelectors.isLn(state)
})

export default connect(mapStateToProps, mapDispatchToProps)(App)

import { connect } from 'react-redux'
import { fetchTicker, setCurrency, tickerSelectors } from 'reducers/ticker'
import { fetchBalance } from 'reducers/balance'
import { fetchInfo } from 'reducers/info'
import { createInvoice, fetchInvoice } from 'reducers/invoice'
import { showModal, hideModal } from 'reducers/modal'
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

import { setPayAmount, setPayInput } from 'reducers/payform'


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
  fetchInvoice,
  showModal
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
  isLn: formSelectors.isLn(state),

  // Props to pass to the payment form modal
  payFormProps: {
    setPayAmount,
    setPayInput,
    onPaySubmit: () => {
      const isOnchain = formSelectors.isOnchain(state)
      const isLn = formSelectors.isLn(state)

      console.log('isOnchain: ', isOnchain)
      console.log('isLn: ', isLn)

      console.log('amount: ', state.payform.amount)
      console.log('inputField: ', state.payform.inputField)
    }
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(App)

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
  setFormType,

  setForm,
  setPaymentType,
  setAmount,
  setOnchainAmount,
  setMessage,
  setPubkey,
  setPaymentRequest,
  formSelectors
} from 'reducers/form'

import { setPayAmount, setPayInput, payFormSelectors } from 'reducers/payform'


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
  showModal,

  setPayAmount,
  setPayInput,

  setFormType
}

const mapStateToProps = state => ({
  ticker: state.ticker,
  balance: state.balance,
  payment: state.payment,
  transaction: state.transaction,
  
  form: state.form,
  payform: state.payform,

  invoice: state.invoice,
  modal: state.modal,

  currentTicker: tickerSelectors.currentTicker(state),
  isOnchain: payFormSelectors.isOnchain(state),
  isLn: payFormSelectors.isLn(state),
  inputCaption: payFormSelectors.inputCaption(state)
})

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const payFormProps = {
    payform: stateProps.payform,
    currency: stateProps.ticker.currency,
    crypto: stateProps.ticker.crypto,

    isOnchain: stateProps.isOnchain,
    isLn: stateProps.isLn,
    inputCaption: stateProps.inputCaption,

    setPayAmount: dispatchProps.setPayAmount,
    setPayInput: dispatchProps.setPayInput,
    fetchInvoice: dispatchProps.fetchInvoice,


    onPaySubmit: () => {
      console.log('do submit stuff')
    }
  }

  const requestFormProps = {

  }

  const formProps = (formType) => {
    if (!formType) { return {} }

    if (formType === 'PAY_FORM') { return payFormProps }
    if (formType === 'REQUEST_FORM') { return requestFormProps }
  }
  
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,

    // action to open the pay form
    openPayForm: () => {
      dispatchProps.setFormType('PAY_FORM')
    },
    // action to open the request form
    openRequestForm: () => {
      dispatchProps.setFormType('REQUEST_FORM')
    },
    // action to close form
    closeForm: () => {
      dispatchProps.setFormType(null)
    },

    // Props to pass to the pay form
    formProps: formProps(stateProps.form.formType)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(App)

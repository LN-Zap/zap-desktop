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
import { setRequestAmount, setRequestMemo } from 'reducers/requestform'


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

  setRequestAmount,setRequestMemo,

  setFormType
}

const mapStateToProps = state => ({
  ticker: state.ticker,
  balance: state.balance,
  payment: state.payment,
  transaction: state.transaction,
  
  form: state.form,
  payform: state.payform,
  requestform: state.requestform,

  invoice: state.invoice,
  modal: state.modal,

  currentTicker: tickerSelectors.currentTicker(state),
  isOnchain: payFormSelectors.isOnchain(state),
  isLn: payFormSelectors.isLn(state),
  currentAmount: payFormSelectors.currentAmount(state),
  inputCaption: payFormSelectors.inputCaption(state),
  showPayLoadingScreen: payFormSelectors.showPayLoadingScreen(state)
})

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const payFormProps = {
    payform: stateProps.payform,
    currency: stateProps.ticker.currency,
    crypto: stateProps.ticker.crypto,

    isOnchain: stateProps.isOnchain,
    isLn: stateProps.isLn,
    currentAmount: stateProps.currentAmount,
    inputCaption: stateProps.inputCaption,
    showPayLoadingScreen: stateProps.showPayLoadingScreen,

    setPayAmount: dispatchProps.setPayAmount,
    setPayInput: dispatchProps.setPayInput,
    fetchInvoice: dispatchProps.fetchInvoice,


    onPaySubmit: () => {
      if (!stateProps.isOnchain && !stateProps.isLn) { return }
      
      if (stateProps.isOnchain) {
        dispatchProps.sendCoins({
          value: stateProps.payform.amount,
          addr: stateProps.payform.payInput,
          currency: stateProps.ticker.currency,
          rate: stateProps.currentTicker.price_usd
        })
      }

      if (stateProps.isLn) {
        dispatchProps.payInvoice(stateProps.payform.invoice.amount)
      }
    }
  }

  const requestFormProps = {
    requestform: stateProps.requestform,
    currency: stateProps.ticker.currency,
    crypto: stateProps.ticker.crypto,

    setRequestAmount: dispatchProps.setRequestAmount,
    setRequestMemo: dispatchProps.setRequestMemo,

    onRequestSubmit: () => {
      dispatchProps.createInvoice(
        stateProps.requestform.amount,
        stateProps.requestform.memo,
        stateProps.ticker.currency,
        stateProps.currentTicker.price_usd
      )
    }
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

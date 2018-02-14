import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import { fetchTicker, setCurrency, tickerSelectors } from 'reducers/ticker'

import { newAddress } from 'reducers/address'

import { fetchInfo } from 'reducers/info'

import { showModal, hideModal } from 'reducers/modal'

import { setFormType } from 'reducers/form'

import { setPayAmount, setPayInput, updatePayErrors, payFormSelectors } from 'reducers/payform'

import { setRequestAmount, setRequestMemo } from 'reducers/requestform'

import { sendCoins } from 'reducers/transaction'

import { payInvoice } from 'reducers/payment'

import { createInvoice, fetchInvoice } from 'reducers/invoice'

import { fetchBlockHeight, lndSelectors } from 'reducers/lnd'

import {
  fetchChannels,
  openChannel,
  closeChannel,
  channelsSelectors,
  currentChannels,
  toggleFilterPulldown,
  changeFilter,
  updateChannelSearchQuery,
  setChannel,
  addInstantPayPubkey,
  removeInstantPayPubkey,
  fetchInstantPayPubkeys
} from 'reducers/channels'

import {
  openContactsForm,
  closeContactsForm,
  updateContactFormSearchQuery,
  updateManualFormSearchQuery,
  updateContactCapacity,
  contactFormSelectors,
  updateManualFormErrors
} from 'reducers/contactsform'

import { fetchBalance } from 'reducers/balance'

import { fetchDescribeNetwork } from 'reducers/network'

import { clearError } from 'reducers/error'

import App from '../components/App'

const mapDispatchToProps = {
  fetchTicker,
  setCurrency,

  newAddress,

  fetchInfo,

  showModal,
  hideModal,

  setFormType,

  setPayAmount,
  setPayInput,
  updatePayErrors,

  setRequestAmount,
  setRequestMemo,


  sendCoins,
  payInvoice,
  createInvoice,
  fetchInvoice,

  fetchBlockHeight,
  clearError,

  fetchBalance,

  fetchChannels,
  openChannel,
  closeChannel,
  toggleFilterPulldown,
  changeFilter,
  updateChannelSearchQuery,
  setChannel,
  addInstantPayPubkey,
  removeInstantPayPubkey,

  openContactsForm,
  closeContactsForm,
  updateContactFormSearchQuery,
  updateManualFormSearchQuery,
  updateContactCapacity,
  contactFormSelectors,
  updateManualFormErrors,

  fetchDescribeNetwork,

  fetchInstantPayPubkeys
}

const mapStateToProps = state => ({
  lnd: state.lnd,

  ticker: state.ticker,
  address: state.address,
  info: state.info,
  payment: state.payment,
  transaction: state.transaction,
  peers: state.peers,
  channels: state.channels,
  contactsform: state.contactsform,
  balance: state.balance,

  form: state.form,
  payform: state.payform,
  requestform: state.requestform,

  invoice: state.invoice,
  modal: state.modal,

  error: state.error,

  network: state.network,

  currentTicker: tickerSelectors.currentTicker(state),
  isOnchain: payFormSelectors.isOnchain(state),
  isLn: payFormSelectors.isLn(state),
  currentAmount: payFormSelectors.currentAmount(state),
  inputCaption: payFormSelectors.inputCaption(state),
  showPayLoadingScreen: payFormSelectors.showPayLoadingScreen(state),
  payFormIsValid: payFormSelectors.payFormIsValid(state),
  syncPercentage: lndSelectors.syncPercentage(state),

  filteredNetworkNodes: contactFormSelectors.filteredNetworkNodes(state),
  showManualForm: contactFormSelectors.showManualForm(state),
  manualFormIsValid: contactFormSelectors.manualFormIsValid(state),

  currentChannels: currentChannels(state),
  activeChannelPubkeys: channelsSelectors.activeChannelPubkeys(state),
  nonActiveChannelPubkeys: channelsSelectors.nonActiveChannelPubkeys(state),
  pendingOpenChannelPubkeys: channelsSelectors.pendingOpenChannelPubkeys(state),
  nonActiveFilters: channelsSelectors.nonActiveFilters(state),
  channelNodes: channelsSelectors.channelNodes(state)
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
    payFormIsValid: stateProps.payFormIsValid,

    setPayAmount: dispatchProps.setPayAmount,
    setPayInput: dispatchProps.setPayInput,
    fetchInvoice: dispatchProps.fetchInvoice,

    onPayAmountBlur: () => {
      // If the amount is now valid and showErrors was on, turn it off
      if (stateProps.payFormIsValid.amountIsValid && stateProps.payform.showErrors.amount) {
        dispatchProps.updatePayErrors({ amount: false })
      }

      // If the amount is not valid and showErrors was off, turn it on
      if (!stateProps.payFormIsValid.amountIsValid && !stateProps.payform.showErrors.amount) {
        dispatchProps.updatePayErrors({ amount: true })
      }
    },

    onPayInputBlur: () => {
      // If the input is now valid and showErrors was on, turn it off
      if (stateProps.payFormIsValid.payInputIsValid && stateProps.payform.showErrors.payInput) {
        dispatchProps.updatePayErrors({ payInput: false })
      }

      // If the input is not valid and showErrors was off, turn it on
      if (!stateProps.payFormIsValid.payInputIsValid && !stateProps.payform.showErrors.payInput) {
        dispatchProps.updatePayErrors({ payInput: true })
      }
    },

    onPaySubmit: () => {
      if (!stateProps.payFormIsValid.isValid) {
        dispatchProps.updatePayErrors({
          amount: Object.prototype.hasOwnProperty.call(stateProps.payFormIsValid.errors, 'amount'),
          payInput: Object.prototype.hasOwnProperty.call(stateProps.payFormIsValid.errors, 'payInput')
        })

        return
      }

      if (stateProps.isOnchain) {
        dispatchProps.sendCoins({
          value: stateProps.payform.amount,
          addr: stateProps.payform.payInput,
          currency: stateProps.ticker.currency,
          rate: stateProps.currentTicker.price_usd
        })
      }

      if (stateProps.isLn) {
        dispatchProps.payInvoice(stateProps.payform.payInput)
      }
    }
  }

  const requestFormProps = {
    requestform: stateProps.requestform,
    currency: stateProps.ticker.currency,
    crypto: stateProps.ticker.crypto,

    setRequestAmount: dispatchProps.setRequestAmount,
    setRequestMemo: dispatchProps.setRequestMemo,

    onRequestSubmit: () => (
      dispatchProps.createInvoice(
        stateProps.requestform.amount,
        stateProps.requestform.memo,
        stateProps.ticker.currency,
        stateProps.currentTicker.price_usd
      )
    )
  }

  const formProps = (formType) => {
    if (!formType) { return {} }

    if (formType === 'PAY_FORM') { return payFormProps }
    if (formType === 'REQUEST_FORM') { return requestFormProps }

    return {}
  }

  const networkTabProps = {
    currentChannels: stateProps.currentChannels,
    channels: stateProps.channels,
    balance: stateProps.balance,
    currentTicker: stateProps.currentTicker,
    contactsform: stateProps.contactsform,
    nodes: stateProps.network.nodes,
    nonActiveFilters: stateProps.nonActiveFilters,

    fetchChannels: dispatchProps.fetchChannels,
    openContactsForm: dispatchProps.openContactsForm,
    contactFormSelectors: dispatchProps.contactFormSelectors,
    updateManualFormError: dispatchProps.updateManualFormErrors,
    toggleFilterPulldown: dispatchProps.toggleFilterPulldown,
    changeFilter: dispatchProps.changeFilter,
    updateChannelSearchQuery: dispatchProps.updateChannelSearchQuery,
    setChannel: dispatchProps.setChannel,
    addInstantPayPubkey: dispatchProps.addInstantPayPubkey,
    removeInstantPayPubkey: dispatchProps.removeInstantPayPubkey
  }

  const contactsFormProps = {
    closeContactsForm: dispatchProps.closeContactsForm,
    updateContactFormSearchQuery: dispatchProps.updateContactFormSearchQuery,
    updateManualFormSearchQuery: dispatchProps.updateManualFormSearchQuery,
    updateContactCapacity: dispatchProps.updateContactCapacity,
    openChannel: dispatchProps.openChannel,
    updateManualFormErrors: dispatchProps.updateManualFormErrors,

    contactsform: stateProps.contactsform,
    filteredNetworkNodes: stateProps.filteredNetworkNodes,
    loadingChannelPubkeys: stateProps.channels.loadingChannelPubkeys,
    showManualForm: stateProps.showManualForm,
    manualFormIsValid: stateProps.manualFormIsValid,
    activeChannelPubkeys: stateProps.activeChannelPubkeys,
    nonActiveChannelPubkeys: stateProps.nonActiveChannelPubkeys,
    pendingOpenChannelPubkeys: stateProps.pendingOpenChannelPubkeys
  }

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,

    // props for the network sidebar
    networkTabProps,
    // props for the contacts form
    contactsFormProps,
    // Props to pass to the pay form
    formProps: formProps(stateProps.form.formType),
    // action to close form
    closeForm: () => dispatchProps.setFormType(null)


  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps, mergeProps)(App))

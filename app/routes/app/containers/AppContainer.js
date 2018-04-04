import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import { btc } from 'utils'

import { fetchTicker, setCurrency, tickerSelectors } from 'reducers/ticker'

import { newAddress, closeWalletModal } from 'reducers/address'

import { fetchInfo } from 'reducers/info'

import { showModal, hideModal } from 'reducers/modal'

import { setFormType } from 'reducers/form'

import { setPayAmount, setPayInput, setCurrencyFilters, updatePayErrors, payFormSelectors } from 'reducers/payform'

import { setRequestAmount, setRequestMemo, setRequestCurrencyFilters, requestFormSelectors } from 'reducers/requestform'

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
  openContactModal,
  closeContactModal
} from 'reducers/channels'

import {
  openContactsForm,
  closeContactsForm,

  setChannelFormType,

  openManualForm,
  closeManualForm,

  openSubmitChannelForm,
  closeSubmitChannelForm,

  updateContactFormSearchQuery,
  updateManualFormSearchQuery,
  updateContactCapacity,
  setNode,

  contactFormSelectors,
  updateManualFormErrors,

  setContactsCurrencyFilters
} from 'reducers/contactsform'

import { fetchBalance } from 'reducers/balance'

import { fetchDescribeNetwork } from 'reducers/network'

import { clearError } from 'reducers/error'

import { hideActivityModal, setActivityModalCurrencyFilters } from 'reducers/activity'

import App from '../components/App'

const mapDispatchToProps = {
  fetchTicker,
  setCurrency,

  newAddress,
  closeWalletModal,

  fetchInfo,

  showModal,
  hideModal,

  setFormType,

  setPayAmount,
  setPayInput,
  setCurrencyFilters,
  updatePayErrors,

  setRequestAmount,
  setRequestMemo,
  setRequestCurrencyFilters,

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
  openContactModal,
  closeContactModal,

  openContactsForm,
  closeContactsForm,
  openSubmitChannelForm,
  closeSubmitChannelForm,
  openManualForm,
  closeManualForm,
  updateContactFormSearchQuery,
  updateManualFormSearchQuery,
  updateContactCapacity,
  setNode,
  contactFormSelectors,
  updateManualFormErrors,
  setContactsCurrencyFilters,
  setChannelFormType,

  fetchDescribeNetwork,

  hideActivityModal,
  setActivityModalCurrencyFilters
}

const mapStateToProps = state => ({
  activity: state.activity,

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
  currentCurrencyFilters: tickerSelectors.currentCurrencyFilters(state),
  currencyName: tickerSelectors.currencyName(state),
  isOnchain: payFormSelectors.isOnchain(state),
  isLn: payFormSelectors.isLn(state),
  currentAmount: payFormSelectors.currentAmount(state),
  usdAmount: payFormSelectors.usdAmount(state),
  inputCaption: payFormSelectors.inputCaption(state),
  showPayLoadingScreen: payFormSelectors.showPayLoadingScreen(state),
  payFormIsValid: payFormSelectors.payFormIsValid(state),
  payInputMin: payFormSelectors.payInputMin(state),
  requestUsdAmount: requestFormSelectors.usdAmount(state),
  syncPercentage: lndSelectors.syncPercentage(state),

  filteredNetworkNodes: contactFormSelectors.filteredNetworkNodes(state),
  showManualForm: contactFormSelectors.showManualForm(state),
  manualFormIsValid: contactFormSelectors.manualFormIsValid(state),
  contactFormUsdAmount: contactFormSelectors.contactFormUsdAmount(state),

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
    nodes: stateProps.network.nodes,
    ticker: stateProps.ticker,

    isOnchain: stateProps.isOnchain,
    isLn: stateProps.isLn,
    currentAmount: stateProps.currentAmount,
    usdAmount: stateProps.usdAmount,
    inputCaption: stateProps.inputCaption,
    showPayLoadingScreen: stateProps.showPayLoadingScreen,
    payFormIsValid: stateProps.payFormIsValid,
    payInputMin: stateProps.payInputMin,
    currentCurrencyFilters: stateProps.currentCurrencyFilters,
    currencyName: stateProps.currencyName,

    setPayAmount: dispatchProps.setPayAmount,
    setPayInput: dispatchProps.setPayInput,
    setCurrencyFilters: dispatchProps.setCurrencyFilters,
    fetchInvoice: dispatchProps.fetchInvoice,
    setCurrency: dispatchProps.setCurrency,

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
    ticker: stateProps.ticker,

    currentCurrencyFilters: stateProps.currentCurrencyFilters,
    showCurrencyFilters: stateProps.showCurrencyFilters,
    currencyName: stateProps.currencyName,
    requestUsdAmount: stateProps.requestUsdAmount,

    setRequestAmount: dispatchProps.setRequestAmount,
    setRequestMemo: dispatchProps.setRequestMemo,
    setCurrency: dispatchProps.setCurrency,
    setRequestCurrencyFilters: dispatchProps.setRequestCurrencyFilters,

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
    openContactModal: dispatchProps.openContactModal
  }

  const contactsFormProps = {
    closeContactsForm: dispatchProps.closeContactsForm,
    openSubmitChannelForm: () => dispatchProps.setChannelFormType('SUBMIT_CHANNEL_FORM'),
    updateContactFormSearchQuery: dispatchProps.updateContactFormSearchQuery,
    updateManualFormSearchQuery: dispatchProps.updateManualFormSearchQuery,
    updateContactCapacity: dispatchProps.updateContactCapacity,
    setNode: dispatchProps.setNode,
    openChannel: dispatchProps.openChannel,
    updateManualFormErrors: dispatchProps.updateManualFormErrors,
    openManualForm: () => dispatchProps.setChannelFormType('MANUAL_FORM'),

    contactsform: stateProps.contactsform,
    filteredNetworkNodes: stateProps.filteredNetworkNodes,
    loadingChannelPubkeys: stateProps.channels.loadingChannelPubkeys,
    showManualForm: stateProps.showManualForm,
    manualFormIsValid: stateProps.manualFormIsValid,
    activeChannelPubkeys: stateProps.activeChannelPubkeys,
    nonActiveChannelPubkeys: stateProps.nonActiveChannelPubkeys,
    pendingOpenChannelPubkeys: stateProps.pendingOpenChannelPubkeys
  }

  const contactModalProps = {
    closeContactModal: dispatchProps.closeContactModal,
    closeChannel: dispatchProps.closeChannel,

    isOpen: stateProps.channels.contactModal.isOpen,
    channel: stateProps.channels.contactModal.channel,
    channelNodes: stateProps.channelNodes,
    closingChannelIds: stateProps.channels.closingChannelIds
  }

  const activityModalProps = {
    modalType: stateProps.activity.modal.modalType,
    modalProps: stateProps.activity.modal.modalProps,
    ticker: stateProps.ticker,
    currentTicker: stateProps.currentTicker,

    hideActivityModal: dispatchProps.hideActivityModal,

    toggleCurrencyProps: {
      currentCurrencyFilters: stateProps.currentCurrencyFilters,
      currencyName: stateProps.currencyName,
      showCurrencyFilters: stateProps.activity.modal.showCurrencyFilters,

      setActivityModalCurrencyFilters: dispatchProps.setActivityModalCurrencyFilters,
      setCurrencyFilters: dispatchProps.setCurrencyFilters,
      onCurrencyFilterClick: (currency) => {
        dispatchProps.setCurrency(currency)
        dispatchProps.setActivityModalCurrencyFilters(false)
      }
    }
  }

  const receiveModalProps = {
    isOpen: stateProps.address.walletModal,
    pubkey: stateProps.info.data.identity_pubkey,
    address: stateProps.address.address,
    newAddress: dispatchProps.newAddress,
    closeReceiveModal: dispatchProps.closeWalletModal
  }

  const submitChannelFormProps = {
    submitChannelFormOpen: stateProps.contactsform.submitChannelFormOpen,
    node: stateProps.contactsform.node,
    contactCapacity: stateProps.contactsform.contactCapacity,

    updateContactCapacity: dispatchProps.updateContactCapacity,
    
    closeChannelForm: () => dispatchProps.setChannelFormType(null),
    closeContactsForm: dispatchProps.closeContactsForm,

    openChannel: dispatchProps.openChannel,

    toggleCurrencyProps: {
      currentCurrencyFilters: stateProps.currentCurrencyFilters,
      currencyName: stateProps.currencyName,
      showCurrencyFilters: stateProps.contactsform.showCurrencyFilters,
      contactFormUsdAmount: stateProps.contactFormUsdAmount,

      setContactsCurrencyFilters: dispatchProps.setContactsCurrencyFilters,
      setCurrencyFilters: dispatchProps.setCurrencyFilters,
      onCurrencyFilterClick: (currency) => {
        dispatchProps.updateContactCapacity(btc.convert(stateProps.ticker.currency, currency, stateProps.contactsform.contactCapacity))
        dispatchProps.setCurrency(currency)
        dispatchProps.setContactsCurrencyFilters(false)
      }
    }
  }

  const connectManuallyProps = {
    closeManualForm: dispatchProps.closeManualForm,
    updateManualFormSearchQuery: dispatchProps.updateManualFormSearchQuery,
    closeChannelForm: () => dispatchProps.setChannelFormType(null),
    
    manualFormOpen: stateProps.contactsform.manualFormOpen,
    manualSearchQuery: stateProps.contactsform.manualSearchQuery
  }

  const calcChannelFormProps = (formType) => {
    if (formType === 'MANUAL_FORM') { return connectManuallyProps }
    if (formType === 'SUBMIT_CHANNEL_FORM') { return submitChannelFormProps }

    return {}
  }

  const channelFormProps = {
    formType: stateProps.contactsform.formType,
    formProps: calcChannelFormProps(stateProps.contactsform.formType),
    closeForm: () => dispatchProps.setChannelFormType(null)
  }


  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,

    // props for the network sidebar
    networkTabProps,
    // props for the contacts form
    contactsFormProps,
    // props for the contact modal
    contactModalProps,
    // props for the receive modal
    receiveModalProps,
    // props for the activity modals
    activityModalProps,
    // props for the form to open a channel
    submitChannelFormProps,
    // props for the form to connect manually to a peer
    connectManuallyProps,
    // props for the channel form wrapper
    channelFormProps,
    // Props to pass to the pay form
    formProps: formProps(stateProps.form.formType),
    // action to close form
    closeForm: () => dispatchProps.setFormType(null)


  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps, mergeProps)(App))

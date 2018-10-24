import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import get from 'lodash.get'

import { btc } from 'lib/utils'

import { themeSelectors } from 'reducers/theme'
import { setCurrency, tickerSelectors, fetchTicker } from 'reducers/ticker'
import { closeWalletModal } from 'reducers/address'
import { fetchInfo, infoSelectors } from 'reducers/info'
import { setFormType } from 'reducers/form'
import { setPayAmount, setPayInput, updatePayErrors, payFormSelectors } from 'reducers/payform'
import { setRequestAmount, setRequestMemo, requestFormSelectors } from 'reducers/requestform'
import { sendCoins } from 'reducers/transaction'
import { payInvoice } from 'reducers/payment'
import { createInvoice, fetchInvoice } from 'reducers/invoice'
import { lndSelectors } from 'reducers/lnd'
import {
  fetchChannels,
  fetchSuggestedNodes,
  openChannel,
  closeChannel,
  channelsSelectors,
  currentChannels,
  toggleFilterPulldown,
  changeFilter,
  updateChannelSearchQuery,
  setSelectedChannel
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
  updateManualFormErrors
} from 'reducers/contactsform'
import { fetchBalance } from 'reducers/balance'
import { fetchDescribeNetwork } from 'reducers/network'
import { clearError } from 'reducers/error'
import { hideActivityModal, activitySelectors } from 'reducers/activity'

import App from 'components/App'
import withLoading from 'components/withLoading'

const mapDispatchToProps = {
  setCurrency,
  closeWalletModal,
  fetchInfo,
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
  clearError,
  fetchBalance,
  fetchChannels,
  fetchSuggestedNodes,
  fetchTicker,
  openChannel,
  closeChannel,
  toggleFilterPulldown,
  changeFilter,
  updateChannelSearchQuery,
  setSelectedChannel,
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
  setChannelFormType,
  fetchDescribeNetwork,
  hideActivityModal
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
  error: state.error,
  network: state.network,
  settings: state.settings,

  isLoading:
    infoSelectors.infoLoading(state) ||
    tickerSelectors.tickerLoading(state) ||
    state.balance.channelBalance === null ||
    state.balance.walletBalance === null,

  activityModalItem: activitySelectors.activityModalItem(state),
  currentTheme: themeSelectors.currentTheme(state),

  currentTicker: tickerSelectors.currentTicker(state),
  currencyFilters: tickerSelectors.currencyFilters(state),
  currencyName: tickerSelectors.currencyName(state),

  isOnchain: payFormSelectors.isOnchain(state),
  isLn: payFormSelectors.isLn(state),
  currentAmount: payFormSelectors.currentAmount(state),
  fiatAmount: payFormSelectors.fiatAmount(state),
  inputCaption: payFormSelectors.inputCaption(state),
  showPayLoadingScreen: payFormSelectors.showPayLoadingScreen(state),
  payFormIsValid: payFormSelectors.payFormIsValid(state),
  payInputMin: payFormSelectors.payInputMin(state),
  requestFiatAmount: requestFormSelectors.fiatAmount(state),
  syncPercentage: lndSelectors.syncPercentage(state),

  filteredNetworkNodes: contactFormSelectors.filteredNetworkNodes(state),
  showManualForm: contactFormSelectors.showManualForm(state),
  manualFormIsValid: contactFormSelectors.manualFormIsValid(state),
  contactFormFiatAmount: contactFormSelectors.contactFormFiatAmount(state),
  dupeChanInfo: contactFormSelectors.dupeChanInfo(state),

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
    fiatAmount: stateProps.fiatAmount,
    inputCaption: stateProps.inputCaption,
    showPayLoadingScreen: stateProps.showPayLoadingScreen,
    payFormIsValid: stateProps.payFormIsValid,
    payInputMin: stateProps.payInputMin,
    currencyFilters: stateProps.currencyFilters,
    currencyName: stateProps.currencyName,

    setPayAmount: dispatchProps.setPayAmount,
    setPayInput: dispatchProps.setPayInput,
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
          payInput: Object.prototype.hasOwnProperty.call(
            stateProps.payFormIsValid.errors,
            'payInput'
          )
        })

        return
      }

      if (stateProps.isOnchain) {
        dispatchProps.sendCoins({
          value: stateProps.payform.amount,
          addr: stateProps.payform.payInput,
          currency: stateProps.ticker.currency
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

    currencyFilters: stateProps.currencyFilters,
    currencyName: stateProps.currencyName,
    requestFiatAmount: stateProps.requestFiatAmount,

    setRequestAmount: dispatchProps.setRequestAmount,
    setRequestMemo: dispatchProps.setRequestMemo,
    setCurrency: dispatchProps.setCurrency,

    onRequestSubmit: () =>
      dispatchProps.createInvoice(
        stateProps.requestform.amount,
        stateProps.requestform.memo,
        stateProps.ticker.currency
      )
  }

  const formProps = formType => {
    if (!formType) {
      return {}
    }

    if (formType === 'PAY_FORM') {
      return payFormProps
    }
    if (formType === 'REQUEST_FORM') {
      return requestFormProps
    }

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
    ticker: stateProps.ticker,
    network: stateProps.info.network,
    currencyName: stateProps.currencyName,

    fetchChannels: dispatchProps.fetchChannels,
    openContactsForm: dispatchProps.openContactsForm,
    contactFormSelectors: dispatchProps.contactFormSelectors,
    updateManualFormError: dispatchProps.updateManualFormErrors,
    toggleFilterPulldown: dispatchProps.toggleFilterPulldown,
    changeFilter: dispatchProps.changeFilter,
    updateChannelSearchQuery: dispatchProps.updateChannelSearchQuery,
    setSelectedChannel: dispatchProps.setSelectedChannel,
    closeChannel: dispatchProps.closeChannel,

    suggestedNodesProps: {
      suggestedNodesLoading: stateProps.channels.suggestedNodesLoading,
      suggestedNodes: stateProps.info.data.testnet
        ? stateProps.channels.suggestedNodes.testnet
        : stateProps.channels.suggestedNodes.mainnet,

      setNode: dispatchProps.setNode,
      openSubmitChannelForm: () => dispatchProps.setChannelFormType('SUBMIT_CHANNEL_FORM')
    }
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

  const activityModalProps = {
    itemType: stateProps.activity.modal.itemType,
    itemId: stateProps.activity.modal.itemId,
    item: stateProps.activityModalItem,

    ticker: stateProps.ticker,
    currentTicker: stateProps.currentTicker,
    network: stateProps.info.network,

    hideActivityModal: dispatchProps.hideActivityModal,

    toggleCurrencyProps: {
      currencyFilters: stateProps.currencyFilters,
      currencyName: stateProps.currencyName,
      setCurrency: dispatchProps.setCurrency
    }
  }

  const receiveModalProps = {
    isOpen: stateProps.address.walletModal,
    network: stateProps.info.network,
    pubkey: get(stateProps.info, 'data.uris[0]') || get(stateProps.info, 'data.identity_pubkey'),
    address: stateProps.address.address,
    alias: stateProps.info.data.alias,
    closeReceiveModal: dispatchProps.closeWalletModal
  }

  const submitChannelFormProps = {
    submitChannelFormOpen: stateProps.contactsform.submitChannelFormOpen,
    node: stateProps.contactsform.node,
    contactCapacity: stateProps.contactsform.contactCapacity,
    fiatTicker: stateProps.ticker.fiatTicker,
    dupeChanInfo: stateProps.dupeChanInfo,

    updateContactCapacity: dispatchProps.updateContactCapacity,

    closeChannelForm: () => dispatchProps.setChannelFormType(null),
    closeContactsForm: dispatchProps.closeContactsForm,

    openChannel: dispatchProps.openChannel,

    ticker: stateProps.ticker,

    toggleCurrencyProps: {
      currencyFilters: stateProps.currencyFilters,
      currencyName: stateProps.currencyName,
      contactFormFiatAmount: stateProps.contactFormFiatAmount,
      setCurrency: dispatchProps.setCurrency,
      onCurrencyFilterClick: currency => {
        dispatchProps.updateContactCapacity(
          btc.convert(stateProps.ticker.currency, currency, stateProps.contactsform.contactCapacity)
        )
        dispatchProps.setCurrency(currency)
      }
    }
  }

  const connectManuallyProps = {
    closeManualForm: dispatchProps.closeManualForm,
    updateManualFormSearchQuery: dispatchProps.updateManualFormSearchQuery,
    updateManualFormErrors: dispatchProps.updateManualFormErrors,
    setNode: dispatchProps.setNode,
    openSubmitChannelForm: () => dispatchProps.setChannelFormType('SUBMIT_CHANNEL_FORM'),

    manualFormOpen: stateProps.contactsform.manualFormOpen,
    manualSearchQuery: stateProps.contactsform.manualSearchQuery,
    manualFormIsValid: stateProps.manualFormIsValid,
    showErrors: stateProps.contactsform.showErrors
  }

  const calcChannelFormProps = formType => {
    if (formType === 'MANUAL_FORM') {
      return connectManuallyProps
    }
    if (formType === 'SUBMIT_CHANNEL_FORM') {
      return submitChannelFormProps
    }

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

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(withLoading(App))
)

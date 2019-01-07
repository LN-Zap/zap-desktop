import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import get from 'lodash.get'

import { themeSelectors } from 'reducers/theme'
import { setCurrency, tickerSelectors } from 'reducers/ticker'
import { closeWalletModal } from 'reducers/address'
import { setFormType } from 'reducers/form'
import { createInvoice, fetchInvoice } from 'reducers/invoice'
import { lndSelectors } from 'reducers/lnd'
import {
  fetchChannels,
  fetchSuggestedNodes,
  openChannel,
  closeChannel,
  channelsSelectors,
  currentChannels,
  changeFilter,
  updateChannelSearchQuery,
  setSelectedChannel
} from 'reducers/channels'
import {
  openContactsForm,
  closeContactsForm,
  openManualForm,
  closeManualForm,
  openSubmitChannelForm,
  closeSubmitChannelForm,
  updateContactFormSearchQuery,
  setNode,
  contactFormSelectors
} from 'reducers/contactsform'
import { fetchBalance } from 'reducers/balance'
import { fetchPeers } from 'reducers/peers'
import { fetchDescribeNetwork } from 'reducers/network'
import { clearError } from 'reducers/error'
import { setIsWalletOpen } from 'reducers/wallet'
import App from 'components/App'
import withLoading from 'components/withLoading'

const mapDispatchToProps = {
  setCurrency,
  closeWalletModal,
  setFormType,
  createInvoice,
  fetchInvoice,
  clearError,
  fetchBalance,
  fetchPeers,
  fetchChannels,
  fetchSuggestedNodes,
  openChannel,
  closeChannel,
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
  setNode,
  contactFormSelectors,
  fetchDescribeNetwork,
  setIsWalletOpen
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
  requestform: state.requestform,
  invoice: state.invoice,
  error: state.error,
  network: state.network,
  settings: state.settings,
  wallet: state.wallet,

  isLoading:
    !tickerSelectors.currentTicker(state) ||
    !tickerSelectors.currencyName(state) ||
    state.balance.channelBalance === null ||
    state.balance.walletBalance === null,

  currentTheme: themeSelectors.currentTheme(state),

  currentTicker: tickerSelectors.currentTicker(state),
  currencyFilters: tickerSelectors.currencyFilters(state),
  currencyName: tickerSelectors.currencyName(state),
  syncPercentage: lndSelectors.syncPercentage(state),
  cryptoName: tickerSelectors.cryptoName(state),

  filteredNetworkNodes: contactFormSelectors.filteredNetworkNodes(state),
  showManualForm: contactFormSelectors.showManualForm(state),

  currentChannels: currentChannels(state),
  activeChannelPubkeys: channelsSelectors.activeChannelPubkeys(state),
  nonActiveChannelPubkeys: channelsSelectors.nonActiveChannelPubkeys(state),
  pendingOpenChannelPubkeys: channelsSelectors.pendingOpenChannelPubkeys(state),
  channelNodes: channelsSelectors.channelNodes(state)
})

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const formProps = formType => {
    if (!formType) {
      return {}
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
    ticker: stateProps.ticker,
    network: stateProps.info.network,
    currencyName: stateProps.currencyName,

    fetchChannels: dispatchProps.fetchChannels,
    openContactsForm: dispatchProps.openContactsForm,
    contactFormSelectors: dispatchProps.contactFormSelectors,
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
      openSubmitChannelForm: () => dispatchProps.openSubmitChannelForm()
    }
  }

  const contactsFormProps = {
    closeContactsForm: dispatchProps.closeContactsForm,
    openSubmitChannelForm: dispatchProps.openSubmitChannelForm,
    updateContactFormSearchQuery: dispatchProps.updateContactFormSearchQuery,
    setNode: dispatchProps.setNode,
    openChannel: dispatchProps.openChannel,
    openManualForm: dispatchProps.openManualForm,

    contactsform: stateProps.contactsform,
    filteredNetworkNodes: stateProps.filteredNetworkNodes,
    loadingChannelPubkeys: stateProps.channels.loadingChannelPubkeys,
    showManualForm: stateProps.showManualForm,
    activeChannelPubkeys: stateProps.activeChannelPubkeys,
    nonActiveChannelPubkeys: stateProps.nonActiveChannelPubkeys,
    pendingOpenChannelPubkeys: stateProps.pendingOpenChannelPubkeys
  }

  const receiveModalProps = {
    isOpen: stateProps.address.walletModal,
    network: stateProps.info.network,
    cryptoName: stateProps.cryptoName,
    pubkey: get(stateProps.info, 'data.uris[0]') || get(stateProps.info, 'data.identity_pubkey'),
    address: stateProps.address.address,
    alias: stateProps.info.data.alias,
    closeReceiveModal: dispatchProps.closeWalletModal
  }

  const channelFormProps = {
    formType: stateProps.contactsform.formType,
    closeForm: () => {
      dispatchProps.closeManualForm()
      dispatchProps.closeSubmitChannelForm()
    }
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
    // props for the channel form wrapper
    channelFormProps,
    // Props to pass to the request form
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

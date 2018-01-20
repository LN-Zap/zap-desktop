import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import {
  fetchChannels,
  openChannel,
  closeChannel,

  updateChannelSearchQuery,
  toggleFilterPulldown,
  changeFilter,
  openContactModal,
  closeContactModal,
  currentChannels,

  channelsSelectors
} from 'reducers/channels'

import { fetchPeers } from 'reducers/peers'

import { fetchDescribeNetwork } from 'reducers/network'

import {
  openContactsForm,
  closeContactsForm,
  updateContactFormSearchQuery,
  updateManualFormSearchQuery,
  updateContactCapacity,
  contactFormSelectors,
  updateManualFormErrors
} from 'reducers/contactsform'

import Contacts from '../components/Contacts'

const mapDispatchToProps = {
  openContactsForm,
  closeContactsForm,
  openContactModal,
  closeContactModal,
  updateContactFormSearchQuery,
  updateManualFormSearchQuery,
  updateContactCapacity,
  openChannel,
  closeChannel,
  updateChannelSearchQuery,
  toggleFilterPulldown,
  changeFilter,
  updateManualFormErrors,
  fetchChannels,
  fetchPeers,
  fetchDescribeNetwork
}

const mapStateToProps = state => ({
  channels: state.channels,
  peers: state.peers,
  network: state.network,
  contactsform: state.contactsform,

  currentChannels: currentChannels(state),
  activeChannels: channelsSelectors.activeChannels(state),
  activeChannelPubkeys: channelsSelectors.activeChannelPubkeys(state),
  nonActiveChannels: channelsSelectors.nonActiveChannels(state),
  nonActiveChannelPubkeys: channelsSelectors.nonActiveChannelPubkeys(state),
  pendingOpenChannels: channelsSelectors.pendingOpenChannels(state),
  pendingOpenChannelPubkeys: channelsSelectors.pendingOpenChannelPubkeys(state),
  closingPendingChannels: channelsSelectors.closingPendingChannels(state),
  nonActiveFilters: channelsSelectors.nonActiveFilters(state),
  channelNodes: channelsSelectors.channelNodes(state),

  filteredNetworkNodes: contactFormSelectors.filteredNetworkNodes(state),
  showManualForm: contactFormSelectors.showManualForm(state),
  manualFormIsValid: contactFormSelectors.manualFormIsValid(state)
})

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const contactModalProps = {
    closeContactModal: dispatchProps.closeContactModal,
    closeChannel: dispatchProps.closeChannel,

    isOpen: stateProps.channels.contactModal.isOpen,
    channel: stateProps.channels.contactModal.channel,
    channelNodes: stateProps.channelNodes,
    closingChannelIds: stateProps.channels.closingChannelIds,
    manualFormIsValid: stateProps.manualFormIsValid
  }

  const contactsFormProps = {
    closeContactsForm: dispatchProps.closeContactsForm,
    updateContactFormSearchQuery: dispatchProps.updateContactFormSearchQuery,
    updateManualFormSearchQuery: dispatchProps.updateManualFormSearchQuery,
    updateContactCapacity: dispatchProps.updateContactCapacity,
    openChannel: dispatchProps.openChannel,
    contactsform: stateProps.contactsform,
    filteredNetworkNodes: stateProps.filteredNetworkNodes,
    loadingChannelPubkeys: stateProps.channels.loadingChannelPubkeys,
    showManualForm: stateProps.showManualForm,
    manualFormIsValid: stateProps.manualFormIsValid,
    activeChannelPubkeys: stateProps.activeChannelPubkeys,
    nonActiveChannelPubkeys: stateProps.nonActiveChannelPubkeys,
    pendingOpenChannelPubkeys: stateProps.pendingOpenChannelPubkeys,
    updateManualFormErrors: dispatchProps.updateManualFormErrors
  }

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,

    contactModalProps,
    contactsFormProps
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps, mergeProps)(Contacts))
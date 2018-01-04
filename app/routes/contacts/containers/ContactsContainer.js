import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import {
  fetchChannels,
  openChannel,

  updateChannelSearchQuery,
  toggleFilterPulldown,
  changeFilter,
  currentChannels,

  channelsSelectors
} from 'reducers/channels'

import { fetchPeers } from 'reducers/peers'

import { fetchDescribeNetwork } from 'reducers/network'

import {
  openContactsForm,
  closeContactsForm,
  updateContactFormSearchQuery,
  updateContactCapacity,
  contactFormSelectors
} from 'reducers/contactsform'

import Contacts from '../components/Contacts'

const mapDispatchToProps = {
  openContactsForm,
  closeContactsForm,
  updateContactFormSearchQuery,
  updateContactCapacity,
  openChannel,
  updateChannelSearchQuery,
  toggleFilterPulldown,
  changeFilter,

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

  filteredNetworkNodes: contactFormSelectors.filteredNetworkNodes(state)
})

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const contactsFormProps = {
    closeContactsForm: dispatchProps.closeContactsForm,
    updateContactFormSearchQuery: dispatchProps.updateContactFormSearchQuery,
    updateContactCapacity: dispatchProps.updateContactCapacity,
    openChannel: dispatchProps.openChannel,

    contactsform: stateProps.contactsform,
    filteredNetworkNodes: stateProps.filteredNetworkNodes,

    activeChannelPubkeys: stateProps.activeChannelPubkeys,
    nonActiveChannelPubkeys: stateProps.nonActiveChannelPubkeys,
    pendingOpenChannelPubkeys: stateProps.pendingOpenChannelPubkeys
  }

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,

    contactsFormProps
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps, mergeProps)(Contacts))

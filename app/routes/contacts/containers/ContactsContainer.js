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
  openFriendsForm,
  closeFriendsForm,
  updateFriendFormSearchQuery,
  friendFormSelectors
} from 'reducers/friendsform'

import Contacts from '../components/Contacts'

const mapDispatchToProps = {
  openFriendsForm,
  closeFriendsForm,
  updateFriendFormSearchQuery,
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
  friendsform: state.friendsform,

  currentChannels: currentChannels(state),
  activeChannels: channelsSelectors.activeChannels(state),
  activeChannelPubkeys: channelsSelectors.activeChannelPubkeys(state),
  nonActiveChannels: channelsSelectors.nonActiveChannels(state),
  nonActiveChannelPubkeys: channelsSelectors.nonActiveChannelPubkeys(state),
  pendingOpenChannels: channelsSelectors.pendingOpenChannels(state),
  pendingOpenChannelPubkeys: channelsSelectors.pendingOpenChannelPubkeys(state),
  closingPendingChannels: channelsSelectors.closingPendingChannels(state),
  nonActiveFilters: channelsSelectors.nonActiveFilters(state),

  filteredNetworkNodes: friendFormSelectors.filteredNetworkNodes(state)
})

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const friendsFormProps = {
    closeFriendsForm: dispatchProps.closeFriendsForm,
    updateFriendFormSearchQuery: dispatchProps.updateFriendFormSearchQuery,
    openChannel: dispatchProps.openChannel,

    friendsform: stateProps.friendsform,
    filteredNetworkNodes: stateProps.filteredNetworkNodes,

    activeChannelPubkeys: stateProps.activeChannelPubkeys,
    nonActiveChannelPubkeys: stateProps.nonActiveChannelPubkeys,
    pendingOpenChannelPubkeys: stateProps.pendingOpenChannelPubkeys
  }

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,

    friendsFormProps
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps, mergeProps)(Contacts))

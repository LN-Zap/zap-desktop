import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import {
  fetchChannels,
  openChannel,
  updateChannelSearchQuery,
  setViewType,
  currentChannels,

  toggleFilterPulldown,
  changeFilter,

  channelsSelectors
} from 'reducers/channels'

import {
  openChannelForm,
  changeStep,
  setNodeKey,
  setLocalAmount,
  setPushAmount,
  closeChannelForm,
  channelFormSelectors
} from 'reducers/channelform'

import { fetchPeers } from 'reducers/peers'

import { tickerSelectors } from 'reducers/ticker'

import { fetchDescribeNetwork, setCurrentChannel } from '../../../reducers/network'

import Channels from '../components/Channels'

const mapDispatchToProps = {
  fetchChannels,
  openChannel,
  updateChannelSearchQuery,
  setViewType,
  toggleFilterPulldown,
  changeFilter,

  openChannelForm,
  closeChannelForm,
  setNodeKey,
  setLocalAmount,
  setPushAmount,
  changeStep,

  fetchPeers,

  fetchDescribeNetwork,
  setCurrentChannel
}

const mapStateToProps = state => ({
  channels: state.channels,
  openChannels: state.channels.channels,
  channelform: state.channelform,
  peers: state.peers,
  ticker: state.ticker,
  network: state.network,
  identity_pubkey: state.info.data.identity_pubkey,

  currentChannels: currentChannels(state),
  activeChanIds: channelsSelectors.activeChanIds(state),
  nonActiveFilters: channelsSelectors.nonActiveFilters(state),

  currentTicker: tickerSelectors.currentTicker(state),

  channelFormHeader: channelFormSelectors.channelFormHeader(state),
  channelFormProgress: channelFormSelectors.channelFormProgress(state),
  stepTwoIsValid: channelFormSelectors.stepTwoIsValid(state)
})

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const channelFormProps = {
    openChannel: dispatchProps.openChannel,
    closeChannelForm: dispatchProps.closeChannelForm,
    changeStep: dispatchProps.changeStep,
    setNodeKey: dispatchProps.setNodeKey,
    setLocalAmount: dispatchProps.setLocalAmount,
    setPushAmount: dispatchProps.setPushAmount,

    channelform: stateProps.channelform,
    channelFormHeader: stateProps.channelFormHeader,
    channelFormProgress: stateProps.channelFormProgress,
    stepTwoIsValid: stateProps.stepTwoIsValid,
    peers: stateProps.peers.peers
  }

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,

    channelFormProps
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps, mergeProps)(Channels))

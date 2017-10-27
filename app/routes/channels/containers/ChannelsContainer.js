import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import {
  fetchChannels,
  openChannel,
  updateChannelSearchQuery,
  setViewType,

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

import Channels from '../components/Channels'

const mapDispatchToProps = {
  fetchChannels,
  openChannel,
  updateChannelSearchQuery,
  setViewType,

  openChannelForm,
  closeChannelForm,
  setNodeKey,
  setLocalAmount,
  setPushAmount,
  changeStep,


  fetchPeers
}

const mapStateToProps = state => ({
  channels: state.channels,
  channelform: state.channelform,
  peers: state.peers,
  ticker: state.ticker,

  allChannels: channelsSelectors.allChannels(state),
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

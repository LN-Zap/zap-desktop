import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import {
  fetchChannels,

  channelsSelectors
} from 'reducers/channels'

import {
  openChannelForm,
  changeStep,
  setNodeKey,
  closeChannelForm,
  channelFormSelectors
} from 'reducers/channelform'

import { fetchPeers } from 'reducers/peers'

import { tickerSelectors } from 'reducers/ticker'

import Channels from '../components/Channels'

const mapDispatchToProps = {
  fetchChannels,
  
  openChannelForm,
  closeChannelForm,
  setNodeKey,
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
  channelFormProgress: channelFormSelectors.channelFormProgress(state)
})

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const channelFormProps = {
    closeChannelForm: dispatchProps.closeChannelForm,
    changeStep: dispatchProps.changeStep,
    setNodeKey: dispatchProps.setNodeKey,

    channelform: stateProps.channelform,
    channelFormHeader: stateProps.channelFormHeader,
    channelFormProgress: stateProps.channelFormProgress,
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

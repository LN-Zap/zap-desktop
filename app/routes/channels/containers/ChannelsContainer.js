import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import {
  fetchChannels,

  channelsSelectors
} from 'reducers/channels'

import { tickerSelectors } from 'reducers/ticker'

import Channels from '../components/Channels'

const mapDispatchToProps = {
  fetchChannels
}

const mapStateToProps = state => ({
  channels: state.channels,
  ticker: state.ticker,

  allChannels: channelsSelectors.allChannels(state),
  currentTicker: tickerSelectors.currentTicker(state)
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Channels))

import { connect } from 'react-redux'
import Channels from 'components/Channels'
import { setFormType } from 'reducers/form'
import {
  changeFilter,
  channelsSelectors,
  closeChannel,
  setSelectedChannel,
  setChannelViewMode,
  updateChannelSearchQuery
} from 'reducers/channels'
import { infoSelectors } from 'reducers/info'
import { tickerSelectors } from 'reducers/ticker'

const mapStateToProps = state => ({
  allChannels: channelsSelectors.allChannels(state),
  channels: channelsSelectors.currentChannels(state),
  channelBalance: state.balance.channelBalance,
  channelViewMode: state.channels.viewMode,
  currencyName: tickerSelectors.currencyName(state),
  filter: state.channels.filter,
  filters: state.channels.filters,
  networkInfo: infoSelectors.networkInfo(state),
  searchQuery: state.channels.searchQuery,
  selectedChannel: channelsSelectors.selectedChannel(state)
})

const mapDispatchToProps = {
  changeFilter,
  closeChannel,
  setSelectedChannel,
  setChannelViewMode,
  setFormType,
  updateChannelSearchQuery
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Channels)

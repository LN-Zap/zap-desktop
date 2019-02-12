import React from 'react'
import PropTypes from 'prop-types'
import debounce from 'lodash.debounce'
import { ChannelDetail, ChannelList } from 'components/Channels'

class Channels extends React.Component {
  static propTypes = {
    allChannels: PropTypes.array,
    channels: PropTypes.array,
    channelBalance: PropTypes.number.isRequired,
    currencyName: PropTypes.string.isRequired,
    filter: PropTypes.string.isRequired,
    filters: PropTypes.array.isRequired,
    searchQuery: PropTypes.string,
    selectedChannel: PropTypes.object,
    changeFilter: PropTypes.func.isRequired,
    setSelectedChannel: PropTypes.func.isRequired,
    updateChannelSearchQuery: PropTypes.func.isRequired,
    channelViewMode: PropTypes.string.isRequired,
    closeChannel: PropTypes.func.isRequired,
    setChannelViewMode: PropTypes.func.isRequired,
    networkInfo: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string
    })
  }

  static defaultProps = {
    allChannels: [],
    channels: []
  }

  /*eslint-disable react/destructuring-assignment*/
  updateChannelSearchQuery = debounce(this.props.updateChannelSearchQuery, 300)

  componentWillUnmount() {
    const { setSelectedChannel } = this.props
    setSelectedChannel(null)
  }

  render() {
    const {
      allChannels,
      channels,
      channelBalance,
      changeFilter,
      channelViewMode,
      currencyName,
      closeChannel,
      filter,
      filters,
      networkInfo,
      selectedChannel,
      setChannelViewMode,
      setSelectedChannel,
      updateChannelSearchQuery,
      searchQuery,
      ...rest
    } = this.props

    return selectedChannel ? (
      <ChannelDetail
        channel={selectedChannel}
        closeChannel={closeChannel}
        currencyName={currencyName}
        setSelectedChannel={setSelectedChannel}
        networkInfo={networkInfo}
      />
    ) : (
      <ChannelList
        allChannels={allChannels}
        channels={channels}
        channelBalance={channelBalance}
        currencyName={currencyName}
        filter={filter}
        filters={filters}
        updateChannelSearchQuery={this.updateChannelSearchQuery}
        channelViewMode={channelViewMode}
        setChannelViewMode={setChannelViewMode}
        searchQuery={searchQuery}
        changeFilter={changeFilter}
        setSelectedChannel={setSelectedChannel}
        networkInfo={networkInfo}
        {...rest}
      />
    )
  }
}

export default Channels

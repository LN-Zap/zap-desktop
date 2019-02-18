import React from 'react'
import PropTypes from 'prop-types'
import debounce from 'lodash.debounce'
import { Panel } from 'components/UI'
import { ChannelsHeader, ChannelCardList, ChannelSummaryList } from 'components/Channels'

export const VIEW_MODE_SUMMARY = 'VIEW_MODE_SUMMARY'
export const VIEW_MODE_CARD = 'VIEW_MODE_CARD'

class ChannelList extends React.Component {
  static propTypes = {
    allChannels: PropTypes.array,
    channels: PropTypes.array,
    channelBalance: PropTypes.number.isRequired,
    currencyName: PropTypes.string.isRequired,
    filter: PropTypes.string.isRequired,
    filters: PropTypes.array.isRequired,
    searchQuery: PropTypes.string,
    changeFilter: PropTypes.func.isRequired,
    setSelectedChannel: PropTypes.func.isRequired,
    setFormType: PropTypes.func.isRequired,
    updateChannelSearchQuery: PropTypes.func.isRequired,
    channelViewMode: PropTypes.string.isRequired,
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

  render() {
    const {
      allChannels,
      channels,
      channelBalance,
      changeFilter,
      channelViewMode,
      currencyName,
      filter,
      filters,
      networkInfo,
      setChannelViewMode,
      setFormType,
      setSelectedChannel,
      updateChannelSearchQuery,
      searchQuery,
      ...rest
    } = this.props

    const VIEW_MODES = {
      [VIEW_MODE_SUMMARY]: ChannelSummaryList,
      [VIEW_MODE_CARD]: ChannelCardList
    }

    const ChannelListView = VIEW_MODES[channelViewMode]

    return (
      <Panel {...rest}>
        <Panel.Header mx={4}>
          <ChannelsHeader
            channels={allChannels}
            channelBalance={channelBalance}
            filter={filter}
            filters={filters}
            updateChannelSearchQuery={this.updateChannelSearchQuery}
            channelViewMode={channelViewMode}
            setChannelViewMode={setChannelViewMode}
            setFormType={setFormType}
            searchQuery={searchQuery}
            changeFilter={changeFilter}
          />
        </Panel.Header>
        <Panel.Body px={4} css={{ 'overflow-y': 'overlay', 'overflow-x': 'hidden' }}>
          <ChannelListView
            channels={channels}
            currencyName={currencyName}
            setSelectedChannel={setSelectedChannel}
            networkInfo={networkInfo}
          />
        </Panel.Body>
      </Panel>
    )
  }
}

export default ChannelList

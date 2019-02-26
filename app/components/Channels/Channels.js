import React from 'react'
import PropTypes from 'prop-types'
import debounce from 'lodash.debounce'
import { Panel } from 'components/UI'
import PersistentTabControl from 'components/TabControl/PersistentTabControl'
import { ChannelsHeader, ChannelCardList, ChannelSummaryList } from 'components/Channels'

export const VIEW_MODE_SUMMARY = 'VIEW_MODE_SUMMARY'
export const VIEW_MODE_CARD = 'VIEW_MODE_CARD'

class Channels extends React.Component {
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
    openModal: PropTypes.func.isRequired,
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
      openModal,
      setSelectedChannel,
      updateChannelSearchQuery,
      searchQuery,
      ...rest
    } = this.props

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
            openModal={openModal}
            searchQuery={searchQuery}
            changeFilter={changeFilter}
          />
        </Panel.Header>
        <Panel.Body px={4} pt={2} css={{ 'overflow-y': 'overlay', 'overflow-x': 'hidden' }}>
          <PersistentTabControl activeTab={channelViewMode === VIEW_MODE_CARD ? 0 : 1}>
            <ChannelCardList
              channels={channels}
              currencyName={currencyName}
              openModal={openModal}
              setSelectedChannel={setSelectedChannel}
              networkInfo={networkInfo}
            />
            <ChannelSummaryList
              channels={channels}
              currencyName={currencyName}
              openModal={openModal}
              setSelectedChannel={setSelectedChannel}
              networkInfo={networkInfo}
            />
          </PersistentTabControl>
        </Panel.Body>
      </Panel>
    )
  }
}

export default Channels

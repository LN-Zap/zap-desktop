import React from 'react'
import PropTypes from 'prop-types'
import debounce from 'lodash.debounce'
import styled from 'styled-components'
import { Panel } from 'components/UI'
import PersistentTabControl from 'components/TabControl/PersistentTabControl'
import ChannelsHeader from './ChannelsHeader'
import ChannelCardList from './ChannelCardList'
import ChannelSummaryList from './ChannelSummaryList'
import { CHANNEL_LIST_VIEW_MODE_CARD } from './constants'

const StyledPersistentTabControl = styled(PersistentTabControl)`
  height: 100%;
`

class Channels extends React.Component {
  static propTypes = {
    allChannels: PropTypes.array,
    changeFilter: PropTypes.func.isRequired,
    channelBalance: PropTypes.number.isRequired,
    channels: PropTypes.array,
    channelViewMode: PropTypes.string.isRequired,
    currencyName: PropTypes.string.isRequired,
    fetchChannels: PropTypes.func.isRequired,
    filter: PropTypes.string.isRequired,
    filters: PropTypes.array.isRequired,
    networkInfo: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    }),
    openModal: PropTypes.func.isRequired,
    searchQuery: PropTypes.string,
    setChannelViewMode: PropTypes.func.isRequired,
    setSelectedChannel: PropTypes.func.isRequired,
    updateChannelSearchQuery: PropTypes.func.isRequired,
  }

  static defaultProps = {
    allChannels: [],
    channels: [],
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
      fetchChannels,
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
            changeFilter={changeFilter}
            channelBalance={channelBalance}
            channels={allChannels}
            channelViewMode={channelViewMode}
            fetchChannels={fetchChannels}
            filter={filter}
            filters={filters}
            openModal={openModal}
            searchQuery={searchQuery}
            setChannelViewMode={setChannelViewMode}
            updateChannelSearchQuery={this.updateChannelSearchQuery}
          />
        </Panel.Header>
        <Panel.Body css={{ overflow: 'hidden' }}>
          <StyledPersistentTabControl
            activeTab={channelViewMode === CHANNEL_LIST_VIEW_MODE_CARD ? 0 : 1}
          >
            <ChannelCardList
              channels={channels}
              currencyName={currencyName}
              networkInfo={networkInfo}
              openModal={openModal}
              setSelectedChannel={setSelectedChannel}
            />
            <ChannelSummaryList
              channels={channels}
              currencyName={currencyName}
              networkInfo={networkInfo}
              openModal={openModal}
              setSelectedChannel={setSelectedChannel}
            />
          </StyledPersistentTabControl>
        </Panel.Body>
      </Panel>
    )
  }
}

export default Channels

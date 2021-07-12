import React from 'react'

import debounce from 'lodash/debounce'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import PersistentTabControl from 'components/TabControl/PersistentTabControl'
import { Panel } from 'components/UI'
import ChannelsHeader from 'containers/Channels/ChannelsHeader'

import ChannelCardList from './ChannelCardList'
import ChannelSummaryList from './ChannelSummaryList'
import { CHANNEL_LIST_VIEW_MODE_CARD } from './constants'

const StyledPersistentTabControl = styled(PersistentTabControl)`
  height: 100%;
`

class Channels extends React.Component {
  /* eslint-disable react/destructuring-assignment */
  updateChannelSearchQuery = debounce(this.props.updateChannelSearchQuery, 300)

  static propTypes = {
    channels: PropTypes.array,
    channelViewMode: PropTypes.string.isRequired,
    cryptoUnitName: PropTypes.string.isRequired,
    networkInfo: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    }),
    openModal: PropTypes.func.isRequired,
    setSelectedChannel: PropTypes.func.isRequired,
    updateChannelSearchQuery: PropTypes.func.isRequired,
  }

  static defaultProps = {
    channels: [],
  }

  render() {
    const {
      channels,
      channelViewMode,
      cryptoUnitName,
      networkInfo,
      openModal,
      setSelectedChannel,
      ...rest
    } = this.props

    return (
      <Panel {...rest}>
        <Panel.Header>
          <ChannelsHeader
            currentChannelCount={channels.length}
            updateChannelSearchQuery={this.updateChannelSearchQuery}
          />
        </Panel.Header>
        <Panel.Body overflow="hidden">
          <StyledPersistentTabControl
            activeTab={channelViewMode === CHANNEL_LIST_VIEW_MODE_CARD ? 0 : 1}
          >
            <ChannelCardList
              channels={channels}
              cryptoUnitName={cryptoUnitName}
              networkInfo={networkInfo}
              openModal={openModal}
              setSelectedChannel={setSelectedChannel}
            />
            <ChannelSummaryList
              channels={channels}
              cryptoUnitName={cryptoUnitName}
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

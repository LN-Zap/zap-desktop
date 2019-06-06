import React from 'react'
import PropTypes from 'prop-types'
import debounce from 'lodash.debounce'
import styled from 'styled-components'
import { Panel } from 'components/UI'
import PersistentTabControl from 'components/TabControl/PersistentTabControl'
import ChannelsHeader from 'containers/Channels/ChannelsHeader'
import ChannelCardList from './ChannelCardList'
import ChannelSummaryList from './ChannelSummaryList'
import { CHANNEL_LIST_VIEW_MODE_CARD } from './constants'

const StyledPersistentTabControl = styled(PersistentTabControl)`
  height: 100%;
`

class Channels extends React.Component {
  static propTypes = {
    channels: PropTypes.array,
    channelViewMode: PropTypes.string.isRequired,
    currencyName: PropTypes.string.isRequired,
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

  /*eslint-disable react/destructuring-assignment*/
  updateChannelSearchQuery = debounce(this.props.updateChannelSearchQuery, 300)

  render() {
    const {
      channels,
      channelViewMode,
      currencyName,
      networkInfo,
      openModal,
      setSelectedChannel,
      updateChannelSearchQuery,
      ...rest
    } = this.props

    return (
      <Panel {...rest}>
        <Panel.Header>
          <ChannelsHeader updateChannelSearchQuery={this.updateChannelSearchQuery} />
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

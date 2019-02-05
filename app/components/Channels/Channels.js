import React from 'react'
import PropTypes from 'prop-types'
import debounce from 'lodash.debounce'
import { Panel } from 'components/UI'
import { ChannelsHeader, ChannelSummaryList } from 'components/Channels'

class Channels extends React.Component {
  static propTypes = {
    allChannels: PropTypes.array,
    channels: PropTypes.array,
    channelBalance: PropTypes.number.isRequired,
    filter: PropTypes.string.isRequired,
    filters: PropTypes.array.isRequired,
    searchQuery: PropTypes.string,
    changeFilter: PropTypes.func.isRequired,
    showChannelDetail: PropTypes.func.isRequired,
    updateChannelSearchQuery: PropTypes.func.isRequired
  }

  static defaultProps = {
    allChannels: [],
    channels: [],
    searchQuery: ''
  }

  /*eslint-disable react/destructuring-assignment*/
  updateChannelSearchQuery = debounce(this.props.updateChannelSearchQuery, 300)

  render() {
    const {
      allChannels,
      channels,
      channelBalance,
      changeFilter,
      filter,
      filters,
      showChannelDetail,
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
            searchQuery={searchQuery}
            changeFilter={changeFilter}
          />
        </Panel.Header>
        <Panel.Body px={4} css={{ 'overflow-y': 'auto', 'overflow-x': 'hidden' }}>
          <ChannelSummaryList channels={channels} showChannelDetail={showChannelDetail} />
        </Panel.Body>
      </Panel>
    )
  }
}

export default Channels

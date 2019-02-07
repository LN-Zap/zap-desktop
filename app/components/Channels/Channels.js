import React from 'react'
import PropTypes from 'prop-types'
import { Panel } from 'components/UI'
import { ChannelsHeader, ChannelSummaryList } from 'components/Channels'

const Channels = ({
  channels,
  channelBalance,
  cryptoCurrency,
  cryptoCurrencies,
  setCryptoCurrency,
  showChannelDetail,
  ...rest
}) => (
  <Panel {...rest}>
    <Panel.Header mx={4}>
      <ChannelsHeader channels={channels} channelBalance={channelBalance} />
    </Panel.Header>
    <Panel.Body px={4} css={{ 'overflow-y': 'auto' }}>
      <ChannelSummaryList channels={channels} showChannelDetail={showChannelDetail} />
    </Panel.Body>
  </Panel>
)

Channels.propTypes = {
  channels: PropTypes.array,
  channelBalance: PropTypes.number.isRequired,
  showChannelDetail: PropTypes.func.isRequired
}

Channels.defaultProps = {
  channels: []
}

export default Channels

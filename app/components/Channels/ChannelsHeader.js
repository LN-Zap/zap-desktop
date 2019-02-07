import React from 'react'
import PropTypes from 'prop-types'
import { Flex } from 'rebass'
import { ChannelBalance, ChannelCount } from 'components/Channels'

const Channels = ({
  channels,
  channelBalance,
  cryptoCurrency,
  cryptoCurrencies,
  setCryptoCurrency,
  ...rest
}) => (
  <Flex as="header" mb={3} alignItems="center" {...rest}>
    <ChannelCount channels={channels} mr={4} />
    <ChannelBalance channelBalance={channelBalance} />
  </Flex>
)

Channels.propTypes = {
  channels: PropTypes.array,
  channelBalance: PropTypes.number.isRequired
}

Channels.defaultProps = {
  channels: []
}

export default Channels

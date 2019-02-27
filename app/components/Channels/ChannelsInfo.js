import React from 'react'
import PropTypes from 'prop-types'
import { Flex } from 'rebass'
import ChannelBalance from './ChannelBalance'
import ChannelCount from './ChannelCount'

const ChannelsInfo = ({ channels, channelBalance, ...rest }) => (
  <Flex as="section" alignItems="center" {...rest}>
    <ChannelCount channels={channels} mr={4} />
    <ChannelBalance channelBalance={channelBalance} />
  </Flex>
)

ChannelsInfo.propTypes = {
  channels: PropTypes.array,
  channelBalance: PropTypes.number.isRequired
}

ChannelsInfo.defaultProps = {
  channels: []
}

export default ChannelsInfo

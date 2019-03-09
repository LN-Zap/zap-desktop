import React from 'react'
import PropTypes from 'prop-types'
import { Flex } from 'rebass'
import ChannelBalance from './ChannelBalance'
import ChannelCount from './ChannelCount'

const ChannelsInfo = ({ channels, channelBalance, ...rest }) => (
  <Flex alignItems="center" as="section" {...rest}>
    <ChannelCount channels={channels} mr={4} />
    <ChannelBalance channelBalance={channelBalance} />
  </Flex>
)

ChannelsInfo.propTypes = {
  channelBalance: PropTypes.number.isRequired,
  channels: PropTypes.array,
}

ChannelsInfo.defaultProps = {
  channels: [],
}

export default ChannelsInfo

import React from 'react'
import PropTypes from 'prop-types'
import { Flex } from 'rebass'
import ChannelBalance from './ChannelBalance'

const ChannelsInfo = ({ channels, channelBalance, ...rest }) => (
  <Flex alignItems="center" as="section" {...rest}>
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

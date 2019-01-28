import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Flex } from 'rebass'
import { StatusIndicator, Text } from 'components/UI'
import messages from './messages'

const variantMap = {
  loading: 'loading',
  pending_open: 'pending',
  open: 'online',
  pending_close: 'closing',
  pending_force_close: 'closing',
  waiting_close: 'closing',
  offline: 'offline'
}

const ChannelStatus = ({ status, ...rest }) => (
  <Flex alignItems="center" {...rest}>
    <Text fontWeight="normal" lineHeight="1em" mr={1}>
      <StatusIndicator variant={variantMap[status]} />
    </Text>
    <Text fontWeight="normal" lineHeight="1em">
      <FormattedMessage {...messages[status]} />
    </Text>
  </Flex>
)

ChannelStatus.propTypes = {
  status: PropTypes.oneOf(Object.keys(variantMap))
}

export default ChannelStatus

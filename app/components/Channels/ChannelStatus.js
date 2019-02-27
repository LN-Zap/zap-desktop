import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
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

const StatusText = styled(Text)`
  white-space: nowrap;
  font-weight: normal;
  line-height: 1em;
`

const ChannelStatus = ({ status, ...rest }) => (
  <Flex alignItems="center" {...rest}>
    <Text fontWeight="normal" lineHeight="1em" mr={1}>
      <StatusIndicator variant={variantMap[status]} />
    </Text>
    <StatusText>
      <FormattedMessage {...messages[status]} />
    </StatusText>
  </Flex>
)

ChannelStatus.propTypes = {
  status: PropTypes.oneOf(Object.keys(variantMap))
}

export default ChannelStatus

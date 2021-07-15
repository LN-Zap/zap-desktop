import React from 'react'

import snakeCase from 'lodash/snakeCase'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Flex } from 'rebass/styled-components'
import styled from 'styled-components'

import { StatusIndicator, Text } from 'components/UI'

import messages from './messages'

const variantMap = {
  loading: 'loading',
  pendingOpen: 'pending',
  open: 'online',
  pendingClose: 'closing',
  pendingForceClose: 'closing',
  waitingClose: 'closing',
  offline: 'offline',
}

const StatusText = styled(Text)`
  white-space: nowrap;
  font-weight: normal;
  line-height: 1em;
`

const ChannelStatus = ({ status, ...rest }) => (
  <Flex alignItems="center" {...rest}>
    <Text fontWeight="normal" lineHeight="1" mr={1}>
      <StatusIndicator variant={variantMap[status]} />
    </Text>
    <StatusText>
      <FormattedMessage {...messages[snakeCase(status)]} />
    </StatusText>
  </Flex>
)

ChannelStatus.propTypes = {
  status: PropTypes.oneOf(Object.keys(variantMap)),
}

export default ChannelStatus

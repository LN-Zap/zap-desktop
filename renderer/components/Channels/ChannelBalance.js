import React from 'react'

import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Flex } from 'rebass/styled-components'

import { Text } from 'components/UI'
import { CryptoSelector, CryptoValue } from 'containers/UI'

import messages from './messages'

const ChannelBalance = ({ channelBalance, ...rest }) => {
  return (
    <Flex alignItems="center" as="section" {...rest}>
      <Text fontWeight="normal" mr={2}>
        <FormattedMessage {...messages.total_capacity} />
      </Text>
      <CryptoValue value={channelBalance} />
      <CryptoSelector ml={2} />
    </Flex>
  )
}

ChannelBalance.propTypes = {
  channelBalance: PropTypes.string.isRequired,
}

export default ChannelBalance

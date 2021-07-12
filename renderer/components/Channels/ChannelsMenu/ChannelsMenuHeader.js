import React from 'react'

import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Box, Flex } from 'rebass/styled-components'

import { Heading } from 'components/UI'

import ChannelsCapacityDonut from '../ChannelsCapacityDonut'
import messages from './messages'

const ChannelsMenuHeader = ({
  lightningBalance,
  channelCount,
  onchainBalance,
  pendingBalance,
  ...rest
}) => {
  return (
    <Flex justifyContent="space-between" {...rest}>
      <Heading.H1>
        <FormattedMessage {...messages.title} />
      </Heading.H1>
      <Box width={80}>
        <ChannelsCapacityDonut
          channelCount={channelCount}
          lightningBalance={lightningBalance}
          onchainBalance={onchainBalance}
          pendingBalance={pendingBalance}
        />
      </Box>
    </Flex>
  )
}

ChannelsMenuHeader.propTypes = {
  channelCount: PropTypes.number.isRequired,
  lightningBalance: PropTypes.string.isRequired,
  onchainBalance: PropTypes.string.isRequired,
  pendingBalance: PropTypes.string.isRequired,
}

export default ChannelsMenuHeader

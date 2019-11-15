import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass/styled-components'
import { FormattedMessage } from 'react-intl'
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
      <Heading.h1>
        <FormattedMessage {...messages.title} />
      </Heading.h1>
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
  lightningBalance: PropTypes.number.isRequired,
  onchainBalance: PropTypes.number.isRequired,
  pendingBalance: PropTypes.number.isRequired,
}

export default ChannelsMenuHeader

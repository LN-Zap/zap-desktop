import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass'
import { FormattedMessage } from 'react-intl'
import { Donut, Heading } from 'components/UI'
import messages from './messages'

const ChannelsMenuHeader = ({
  lightningBalance,
  channelCount,
  onchainBalance,
  pendingBalance,
  ...rest
}) => {
  const total = lightningBalance + onchainBalance + pendingBalance
  const lightningBalancePercent = lightningBalance / total
  const onchainBalancePercent = onchainBalance / total
  const pendingBalancePercent = pendingBalance / total

  return (
    <Flex justifyContent="space-between" {...rest}>
      <Heading.h1>
        <FormattedMessage {...messages.title} />
      </Heading.h1>
      <Box width={80}>
        <Donut
          data={[
            {
              key: 'lightning',
              amount: lightningBalancePercent || 0,
              color: 'lightningOrange',
              withGlow: true,
              withTint: true,
            },
            {
              key: 'pending',
              amount: pendingBalancePercent || 0,
              color: 'gray',
              withTint: true,
            },
            {
              key: 'onchain',
              amount: onchainBalancePercent || 0,
              color: 'secondaryColor',
              withTint: true,
            },
          ]}
          text={channelCount}
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

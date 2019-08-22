import React from 'react'
import PropTypes from 'prop-types'
import { Box } from 'rebass/styled-components'
import { Donut } from 'components/UI'

const ChannelsCapacityDonut = ({
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
    <Box {...rest}>
      <Donut
        data={[
          {
            key: 'lightning',
            amount: lightningBalancePercent || 0,
            color: 'primaryAccent',
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
  )
}

ChannelsCapacityDonut.propTypes = {
  channelCount: PropTypes.number.isRequired,
  lightningBalance: PropTypes.number.isRequired,
  onchainBalance: PropTypes.number.isRequired,
  pendingBalance: PropTypes.number.isRequired,
}

export default ChannelsCapacityDonut

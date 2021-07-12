import React from 'react'

import PropTypes from 'prop-types'
import { Box } from 'rebass/styled-components'

import { CoinBig } from '@zap/utils/coin'
import { Donut } from 'components/UI'

const ChannelsCapacityDonut = ({
  lightningBalance,
  channelCount,
  onchainBalance,
  pendingBalance,
  ...rest
}) => {
  const total = CoinBig.sum(lightningBalance, onchainBalance, pendingBalance)
  const lightningBalancePercent = CoinBig(lightningBalance)
    .dividedBy(total)
    .toNumber()
  const onchainBalancePercent = CoinBig(onchainBalance)
    .dividedBy(total)
    .toNumber()
  const pendingBalancePercent = CoinBig(pendingBalance)
    .dividedBy(total)
    .toNumber()

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
  lightningBalance: PropTypes.string.isRequired,
  onchainBalance: PropTypes.string.isRequired,
  pendingBalance: PropTypes.string.isRequired,
}

export default ChannelsCapacityDonut

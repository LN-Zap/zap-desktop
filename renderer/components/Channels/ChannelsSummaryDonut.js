import React from 'react'

import PropTypes from 'prop-types'
import { Box } from 'rebass/styled-components'

import { CoinBig } from '@zap/utils/coin'
import { Donut } from 'components/UI'

const ChannelsSummaryDonut = ({ sendCapacity, receiveCapacity, ...rest }) => {
  const total = CoinBig.sum(sendCapacity, receiveCapacity)
  const sendCapacityPercent = CoinBig(sendCapacity)
    .dividedBy(total)
    .toNumber()
  const receiveCapacityPercent = CoinBig(receiveCapacity)
    .dividedBy(total)
    .toNumber()

  return (
    <Box {...rest}>
      <Donut
        data={[
          {
            key: 'send',
            amount: sendCapacityPercent || 0,
            color: 'primaryAccent',
            withGlow: true,
            withTint: true,
          },
          {
            key: 'reeive',
            amount: receiveCapacityPercent || 0,
            color: 'superBlue',
            withTint: true,
          },
        ]}
        strokeWidth={2}
      />
    </Box>
  )
}

ChannelsSummaryDonut.propTypes = {
  receiveCapacity: PropTypes.string.isRequired,
  sendCapacity: PropTypes.string.isRequired,
}

export default ChannelsSummaryDonut

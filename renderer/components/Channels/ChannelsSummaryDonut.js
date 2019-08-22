import React from 'react'
import PropTypes from 'prop-types'
import { Box } from 'rebass/styled-components'
import { Donut } from 'components/UI'

const ChannelsSummaryDonut = ({ sendCapacity, receiveCapacity, ...rest }) => {
  const total = sendCapacity + receiveCapacity
  const sendCapacityPercent = sendCapacity / total
  const receiveCapacityPercent = receiveCapacity / total

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
  receiveCapacity: PropTypes.number.isRequired,
  sendCapacity: PropTypes.number.isRequired,
}

export default ChannelsSummaryDonut

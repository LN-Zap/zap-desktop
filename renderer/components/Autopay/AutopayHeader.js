import React from 'react'

import { Box } from 'rebass/styled-components'

import AutopayHeading from './AutopayHeading'

const AutopayHeader = props => (
  <Box {...props}>
    <AutopayHeading mb={3} />
  </Box>
)

export default AutopayHeader

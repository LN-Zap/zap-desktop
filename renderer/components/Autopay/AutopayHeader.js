import React from 'react'
import { Box } from 'rebass'
import AutopayActions from './AutopayActions'
import AutopayHeading from './AutopayHeading'

const AutopayHeader = props => (
  <Box {...props}>
    <AutopayHeading mb={3} />
    <AutopayActions mb={3} />
  </Box>
)

export default AutopayHeader

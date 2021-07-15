import React from 'react'

import { Box } from 'rebass/styled-components'

import AutopaySearch from 'containers/Autopay/AutopaySearch'

const AutopayActions = props => (
  <Box {...props} width={450}>
    <AutopaySearch />
  </Box>
)

export default AutopayActions

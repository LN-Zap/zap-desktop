import React from 'react'

import { Box } from 'rebass/styled-components'

const MainContent = props => (
  <Box
    as="article"
    height="100%"
    {...props}
    sx={{
      flex: 1,
      overflowY: 'overlay',
      overflowX: 'hidden',
    }}
  />
)

export default MainContent

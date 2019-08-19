import React from 'react'
import { Box } from 'rebass/styled-components'

const MainContent = props => (
  <Box
    as="article"
    css={`
      height: 100%;
      overflow-y: overlay;
      overflow-x: hidden;
      flex: 1;
    `}
    {...props}
  />
)

export default MainContent

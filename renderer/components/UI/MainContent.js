import React from 'react'
import { Box } from 'rebass'

/**
 * @render react
 * @name MainContent
 * @example
 * <MainContent>Some content</MainContent>
 */
const MainContent = props => (
  <Box
    as="article"
    css={`
      height: 100%;
      overflow-y: overlay;
      overflow-x: hidden;
    `}
    width={1}
    {...props}
  />
)

export default MainContent

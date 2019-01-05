import React from 'react'
import { BackgroundPrimary } from 'components/UI'

/**
 * @render react
 * @name MainContent
 * @example
 * <MainContent>Some content</MainContent>
 */
const MainContent = ({ css, ...rest }) => (
  <BackgroundPrimary as="article" width={1} css={{ 'overflow-y': 'auto' }} {...rest} />
)

export default MainContent

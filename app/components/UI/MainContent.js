import React from 'react'
import { BackgroundPrimary } from 'components/UI'

/**
 * @render react
 * @name MainContent
 * @example
 * <MainContent>Some content</MainContent>
 */
const MainContent = props => (
  <BackgroundPrimary as="article" width={1} p={3} css={{ height: '100%' }} {...props} />
)

export default MainContent

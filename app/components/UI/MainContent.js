import React from 'react'
import { BackgroundDark } from 'components/UI'

/**
 * @render react
 * @name MainContent
 * @example
 * <MainContent>Some content</MainContent>
 */
const MainContent = props => (
  <BackgroundDark as="article" width={1} p={3} css={{ height: '100%' }} {...props} />
)

export default MainContent

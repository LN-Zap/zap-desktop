import React from 'react'
import { BackgroundPrimary } from 'components/UI'

/**
 * @render react
 * @name MainContent
 * @example
 * <MainContent>Some content</MainContent>
 */
const MainContent = ({ ...rest }) => <BackgroundPrimary as="article" width={1} {...rest} />

export default MainContent

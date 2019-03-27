import React from 'react'
import BackgroundTertiary from './BackgroundTertiary'

/**
 * @render react
 * @name Sidebar
 * @example
 * <Sidebar>Some content</Sidebar>
 */
const Sidebar = ({ ...props }) => (
  <BackgroundTertiary as="aside" css={{ overflow: 'hidden' }} width={3 / 12} {...props} />
)

Sidebar.small = props => <Sidebar {...props} width={4 / 16} />
Sidebar.medium = props => <Sidebar {...props} width={5 / 16} />
Sidebar.large = props => <Sidebar {...props} width={6 / 16} />

Sidebar.small.displayName = 'Sidebar Small'
Sidebar.medium.displayName = 'Sidebar Medium'
Sidebar.large.displayName = 'Sidebar Large'

export default Sidebar

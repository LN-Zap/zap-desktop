import React from 'react'
import { BackgroundTertiary } from 'components/UI'

/**
 * @render react
 * @name Sidebar
 * @example
 * <Sidebar>Some content</Sidebar>
 */
const Sidebar = ({ css, ...rest }) => (
  <BackgroundTertiary
    as="aside"
    width={3 / 12}
    {...rest}
    css={Object.assign(
      {
        position: 'relative',
        'overflow-y': 'scroll'
      },
      css
    )}
  />
)

Sidebar.small = props => <Sidebar {...props} width={3 / 12} />
Sidebar.medium = props => <Sidebar {...props} width={4 / 12} />
Sidebar.large = props => <Sidebar {...props} width={5 / 12} />

Sidebar.small.displayName = 'Sidebar Small'
Sidebar.medium.displayName = 'Sidebar Medium'
Sidebar.large.displayName = 'Sidebar Large'

export default Sidebar

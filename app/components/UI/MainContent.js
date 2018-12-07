import React from 'react'
import { BackgroundPrimary } from 'components/UI'

/**
 * @render react
 * @name MainContent
 * @example
 * <MainContent>Some content</MainContent>
 */
const MainContent = ({ css, ...rest }) => (
  <BackgroundPrimary
    as="article"
    width={1}
    {...rest}
    css={Object.assign(
      {
        position: 'relative',
        'overflow-y': 'auto'
      },
      css
    )}
  />
)

export default MainContent

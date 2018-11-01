import React from 'react'
import { Flex } from 'rebass'

/**
 * @render react
 * @name Page
 * @example
 * <Page>Some content</Page>
 */
const Page = props => (
  <Flex
    {...props}
    as="article"
    alignItems="stretch"
    bg="darkestBackground"
    css={{
      'min-height': '700px',
      'min-width': '950px',
      'overflow-y': 'hidden',
      'box-shadow': '0 3px 4px 0 rgba(30, 30, 30, 0.5)'
    }}
  />
)

export default Page

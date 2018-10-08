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
    width="950"
    bg="white"
    css={{ height: '600px', 'min-height': '700px', 'min-width': '950px' }}
  />
)

export default Page

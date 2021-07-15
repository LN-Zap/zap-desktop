import React from 'react'

import { Flex } from 'rebass/styled-components'

const CenteredContent = props => (
  <Flex
    alignItems="center"
    flexDirection="column"
    height="100%"
    justifyContent="center"
    width={1}
    {...props}
  />
)

export default CenteredContent

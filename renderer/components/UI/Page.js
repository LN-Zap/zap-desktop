import React from 'react'
import { Flex } from 'rebass'
import { themeGet } from 'styled-system'

const Page = props => (
  <Flex
    as="article"
    bg="primaryColor"
    color="primaryText"
    css={`
      position: relative;
      height: 100%;
      overflow: hidden;
      min-width: 900px;
      min-height: 425px;
      box-shadow: ${themeGet('shadows.l')};
    `}
    {...props}
  />
)

export default Page

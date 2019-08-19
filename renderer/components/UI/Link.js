import React from 'react'
import Text from './Text'

const Link = props => (
  <Text as="a" css="cursor: pointer; text-decoration: underline;" variant="link" {...props} />
)

export default Link

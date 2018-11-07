import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass'
import { Bar, Heading, Page } from 'components/UI'

export const Window = props => <Page css={{ height: 'calc(100vh - 40px)' }} {...props} />
export const Column = props => <Box width={1 / 2} mr={5} {...props} />
export const Group = ({ title, children, withBar = true }) => (
  <Box mb={4}>
    <Heading.h3 mb={2} fontWeight="normal">
      {title}
    </Heading.h3>
    {withBar && <Bar mb={3} />}
    {children}
  </Box>
)
Group.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  withBar: PropTypes.bool
}
export const Element = props => <Box py={1} {...props} />
export const Content = ({ children }) => (
  <Flex justifyContent="center" alignItems="center" css={{ height: '100%' }}>
    <Heading>{children}</Heading>
  </Flex>
)
Content.propTypes = {
  children: PropTypes.node
}

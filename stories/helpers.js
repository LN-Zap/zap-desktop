import React from 'react'
import PropTypes from 'prop-types'
import { Box } from 'rebass'
import { Bar, Heading } from 'components/UI'

export const Column = props => <Box width={1 / 2} mr={5} {...props} />
export const Group = ({ title, children }) => (
  <Box mb={4}>
    <Heading.h3 mb={2} fontWeight="normal">
      {title}
    </Heading.h3>
    <Bar mb={3} />
    {children}
  </Box>
)
Group.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node
}
export const Element = props => <Box py={1} {...props} />

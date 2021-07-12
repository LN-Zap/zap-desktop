import React from 'react'

import PropTypes from 'prop-types'
import { Flex } from 'rebass/styled-components'

import Heading from './Heading'
import Text from './Text'

const Header = ({ title, subtitle, align, logo }) => (
  <Flex alignItems={align} as="header" flexDirection="column" justifyContent={align}>
    {logo && (
      <Text fontSize="50px" lineHeight="1" textAlign={align}>
        {logo}
      </Text>
    )}
    {title && (
      <Heading.H1 mb={1} textAlign={align}>
        {title}
      </Heading.H1>
    )}
    {subtitle && <Heading.H4 textAlign={align}>{subtitle}</Heading.H4>}
  </Flex>
)
Header.propTypes = {
  align: PropTypes.string,
  logo: PropTypes.node,
  subtitle: PropTypes.node,
  title: PropTypes.node,
}
Header.defaultProps = {
  align: 'center',
}

export default Header

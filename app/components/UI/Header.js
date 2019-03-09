import React from 'react'
import PropTypes from 'prop-types'
import { Flex } from 'rebass'
import Heading from './Heading'
import Text from './Text'

const Header = ({ title, subtitle, align, logo }) => (
  <Flex alignItems={align} as="header" flexDirection="column" justifyContent={align}>
    {logo && (
      <Text css={{ height: '50px' }} fontSize="50px" lineHeight="1em" textAlign={align}>
        {logo}
      </Text>
    )}
    {title && (
      <Heading.h1 mb={1} textAlign={align}>
        {title}
      </Heading.h1>
    )}
    {subtitle && <Heading.h4 textAlign={align}>{subtitle}</Heading.h4>}
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

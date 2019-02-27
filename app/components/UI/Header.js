import React from 'react'
import PropTypes from 'prop-types'
import { Flex } from 'rebass'
import Heading from './Heading'
import Text from './Text'

const Header = ({ title, subtitle, align, logo }) => (
  <Flex alignItems={align} as="header" flexDirection="column" justifyContent={align}>
    {logo && (
      <Text textAlign={align} fontSize="50px" lineHeight="1em" css={{ height: '50px' }}>
        {logo}
      </Text>
    )}
    {title && (
      <Heading.h1 textAlign={align} mb={1}>
        {title}
      </Heading.h1>
    )}
    {subtitle && <Heading.h4 textAlign={align}>{subtitle}</Heading.h4>}
  </Flex>
)
Header.propTypes = {
  title: PropTypes.node,
  subtitle: PropTypes.node,
  logo: PropTypes.node,
  align: PropTypes.string
}
Header.defaultProps = {
  align: 'center'
}

export default Header

import React from 'react'
import PropTypes from 'prop-types'
import { Flex } from 'rebass'
import { Heading, Text } from 'components/UI'

const Header = ({ title, subtitle, logo }) => (
  <Flex alignItems="center" as="header" flexDirection="column">
    {logo && (
      <Flex alignItems="center" justifyContent="center">
        <Text fontSize="50px" lineHeight="1em" css={{ height: '50px' }}>
          {logo}
        </Text>
      </Flex>
    )}
    {title && <Heading.h1>{title}</Heading.h1>}
    {subtitle && <Heading.h4>{subtitle}</Heading.h4>}
  </Flex>
)
Header.propTypes = {
  title: PropTypes.node,
  subtitle: PropTypes.node,
  logo: PropTypes.node
}

export default Header

import React from 'react'
import PropTypes from 'prop-types'
import { Card, Flex } from 'rebass'
import Text from './Text'

const HeaderBar = ({ children, ...rest }) => (
  <Card
    bg="secondaryColor"
    boxShadow="0 2px 24px 0 rgba(0, 0, 0, 0.5)"
    px={5}
    py={2}
    {...rest}
    css={`
      height: 50px;
    `}
  >
    <Flex
      alignItems="center"
      css={`
        height: 100%;
      `}
      width={1}
    >
      <Text fontWeight="normal" width={1}>
        {children}
      </Text>
    </Flex>
  </Card>
)

HeaderBar.propTypes = {
  children: PropTypes.node,
}

export default HeaderBar

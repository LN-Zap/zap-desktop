import React from 'react'
import PropTypes from 'prop-types'
import { Card } from 'rebass'
import Text from './Text'

const HeaderBar = ({ children, ...rest }) => (
  <Card bg="secondaryColor" boxShadow="0 2px 24px 0 rgba(0, 0, 0, 0.5)" pl={5} py={2} {...rest}>
    <Text fontWeight="normal" py={2}>
      {children}
    </Text>
  </Card>
)

HeaderBar.propTypes = {
  children: PropTypes.node,
}

export default HeaderBar

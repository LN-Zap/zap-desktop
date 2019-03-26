import React from 'react'
import PropTypes from 'prop-types'
import { Card as BaseCard } from 'rebass'

const Card = ({ children, ...rest }) => (
  <BaseCard
    as="section"
    bg="primaryColor"
    borderRadius={5}
    boxShadow="0 2px 24px 0 rgba(0, 0, 0, 0.5)"
    color="primaryText"
    p={3}
    {...rest}
  >
    {children}
  </BaseCard>
)

Card.propTypes = {
  children: PropTypes.node,
}

export default Card

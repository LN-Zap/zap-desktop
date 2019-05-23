import React from 'react'
import { Card as BaseCard } from 'rebass'

const Card = React.forwardRef((props, ref) => {
  return (
    <BaseCard
      ref={ref}
      as="section"
      bg="primaryColor"
      borderRadius={5}
      boxShadow="0 2px 24px 0 rgba(0, 0, 0, 0.5)"
      color="primaryText"
      p={3}
      {...props}
    />
  )
})

Card.displayName = 'Card'

export default Card

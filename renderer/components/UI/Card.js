import React from 'react'
import styled from 'styled-components'
import { height } from 'styled-system'
import { Card as BaseCard } from 'rebass/styled-components'

const StyledCard = styled(BaseCard)(height)

const Card = React.forwardRef((props, ref) => {
  return (
    <StyledCard
      ref={ref}
      as="section"
      bg="primaryColor"
      borderRadius={5}
      boxShadow="m"
      color="primaryText"
      p={3}
      {...props}
    />
  )
})

Card.displayName = 'Card'

export default Card

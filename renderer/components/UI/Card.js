import React from 'react'
import PropTypes from 'prop-types'
import { Card as BaseCard } from 'rebass/styled-components'

const Card = React.forwardRef(({ sx, ...rest }, ref) => {
  return (
    <BaseCard
      ref={ref}
      as="section"
      bg="primaryColor"
      color="primaryText"
      p={3}
      sx={{
        borderRadius: 's',
        boxShadow: 'm',
        ...sx,
      }}
      {...rest}
    />
  )
})

Card.propTypes = {
  sx: PropTypes.object,
}

Card.displayName = 'Card'

export default Card

import React from 'react'

import Button from 'components/UI/Button'

const MenuItem = props => (
  <Button justify="left" mb={1} size="small" type="button" variant="menu" width={1} {...props} />
)

export default MenuItem

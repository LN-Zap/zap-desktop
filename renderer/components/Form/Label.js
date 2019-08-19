import React from 'react'
import { Label as BaseLabel } from '@rebass/forms'

const Label = props => <BaseLabel {...props} />

Label.defaultProps = {
  color: 'primaryText',
  fontWeight: 'normal',
  mb: 1,
}

export default Label

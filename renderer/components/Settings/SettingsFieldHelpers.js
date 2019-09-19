import React from 'react'
import { IntegerInput } from 'components/Form'

export const PositiveIntegerField = props => (
  <IntegerInput
    highlightOnValid={false}
    isRequired
    justifyContent="flex-end"
    max={9999}
    min={1}
    step="1"
    textAlign="right"
    validateOnBlur
    validateOnChange
    width={100}
    {...props}
  />
)

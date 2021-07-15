import React from 'react'

import { RadioGroup as InformedRadioGroup } from 'informed'
import PropTypes from 'prop-types'

import { Text } from 'components/UI'

import Label from './Label'

const RadioGroup = ({ label, field, description, isRequired, tooltip, children, ...rest }) => (
  <>
    {label && (
      <Label htmlFor={field} isRequired={isRequired} mb={2} tooltip={tooltip}>
        {label}
      </Label>
    )}

    <InformedRadioGroup field={field} required={isRequired} {...rest}>
      {children}
    </InformedRadioGroup>

    {description && (
      <Text color="gray" fontSize="s" mt={2}>
        {description}
      </Text>
    )}
  </>
)

RadioGroup.propTypes = {
  children: PropTypes.node,
  description: PropTypes.node,
  field: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  label: PropTypes.node,
  tooltip: PropTypes.string,
}

export default RadioGroup

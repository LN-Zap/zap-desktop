import React from 'react'
import PropTypes from 'prop-types'
import { RadioGroup as InformedRadioGroup } from 'informed'
import { Label, Span, Text } from 'components/UI'

const RadioGroup = ({ label, field, description, required, children, ...rest }) => (
  <>
    {label && (
      <Label htmlFor={field} mb={2}>
        {label}
        {required && (
          <Span fontSize="s" css={{ 'vertical-align': 'super' }}>
            {' '}
            *
          </Span>
        )}
      </Label>
    )}

    <InformedRadioGroup field={field} required={required} {...rest}>
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
  description: PropTypes.node,
  label: PropTypes.node,
  field: PropTypes.string.isRequired,
  required: PropTypes.bool,
  children: PropTypes.node
}

export default RadioGroup

import React from 'react'
import PropTypes from 'prop-types'
import { RadioGroup as InformedRadioGroup } from 'informed'
import Label from './Label'
import Span from './Span'
import Text from './Text'

const RadioGroup = ({ label, field, description, isRequired, children, ...rest }) => (
  <>
    {label && (
      <Label htmlFor={field} mb={2}>
        {label}
        {isRequired && (
          <Span css={{ 'vertical-align': 'top' }} fontSize="s">
            {' '}
            *
          </Span>
        )}
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
}

export default RadioGroup

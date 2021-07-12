import React from 'react'

import PropTypes from 'prop-types'
import * as yup from 'yup'

import getDisplayName from '@zap/utils/getDisplayName'

const isEmptyAmount = amount => amount === undefined || amount === null || amount === ''

/**
 * withNumberValidation - A HOC that will add validation of a `required` property to a field.
 *
 * @param {React.Component} Component Component to wrap
 * @returns {React.Component} Wrapped component
 */
const withNumberValidation = Component => {
  const WrappedComponent = ({
    isDisabled,
    isRequired,
    lessThan,
    max,
    min,
    moreThan,
    validate,
    ...rest
  }) => {
    const handleValidate = value => {
      if (isDisabled) {
        return undefined
      }
      try {
        let validator = yup.number().typeError('A number is required')
        if (isRequired) {
          validator = validator.required()
        }
        if (!isEmptyAmount(min)) {
          validator = validator.min(min)
        }
        if (!isEmptyAmount(max)) {
          validator = validator.max(max)
        }
        if (!isEmptyAmount(moreThan)) {
          validator = validator.moreThan(moreThan)
        }
        if (!isEmptyAmount(lessThan)) {
          validator = validator.lessThan(lessThan)
        }
        validator.validateSync(value)
      } catch (error) {
        return error.message
      }

      // Run any additional validation provided by the caller.
      if (validate) {
        return validate(value)
      }
      return undefined
    }

    return (
      <Component
        {...rest}
        isDisabled={isDisabled}
        isRequired={isRequired}
        validate={handleValidate}
      />
    )
  }

  WrappedComponent.propTypes = {
    isDisabled: PropTypes.bool,
    isRequired: PropTypes.bool,
    lessThan: PropTypes.number,
    max: PropTypes.number,
    min: PropTypes.number,
    moreThan: PropTypes.number,
    validate: PropTypes.func,
  }

  WrappedComponent.displayName = `WithNumberValidation(${getDisplayName(Component)})`

  return WrappedComponent
}

export default withNumberValidation

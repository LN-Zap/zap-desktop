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
const withNumberValidation = Component =>
  class extends React.Component {
    static displayName = `WithNumberValidation(${getDisplayName(Component)})`

    static propTypes = {
      isDisabled: PropTypes.bool,
      isRequired: PropTypes.bool,
      lessThan: PropTypes.number,
      max: PropTypes.number,
      min: PropTypes.number,
      moreThan: PropTypes.number,
      validate: PropTypes.func,
    }

    static defaultProps = {
      isDisabled: false,
      isRequired: false,
    }

    validate = (value = 0) => {
      const { isDisabled, isRequired, min, max, moreThan, lessThan } = this.props
      if (isDisabled) {
        return
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
      const { validate } = this.props
      if (validate) {
        return validate(value)
      }
    }

    render() {
      return <Component {...this.props} validate={this.validate} />
    }
  }

export default withNumberValidation

/* eslint-disable react/no-multi-comp */

import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { asField } from 'informed'
import * as yup from 'yup'
import { withInputValidation } from 'hocs'
import { BasicInput } from './Input'

// Regex to check for only numeric values.
const isNumericRegex = /^\d+$/

/**
 * isNumeric - Test if a string contains only numeric values.
 *
 * @param  {string} value Value
 * @returns {boolean} Boolean indicating whether value is numeric
 */
const isNumeric = value => isNumericRegex.test(value)

/**
 * convertToNumber - Convert value to number.
 *
 * @param  {string} value Value
 * @returns {number} Value as number
 */
const convertToNumber = value => {
  const valueAsNumber = Number(value)
  return Number.isNaN(valueAsNumber) ? undefined : valueAsNumber
}

/**
 * preventNonNumeric - Prevent entry of non-numeric values.
 *
 * @param {Event} e Event
 */
const preventNonNumeric = e => {
  e.persist()

  // Do nothing if the key press includes a meta key (support copy/paste etc)
  if (e.metaKey || e.ctrlKey) {
    return
  }

  // Prevent non-numeric values.
  if (e.key.length === 1 && !e.key.match(/^[0-9]$/)) {
    e.preventDefault()
  }
}

/**
 * preventNonNumericOnPaste - Prevent entry of non-numeric values on paste.
 *
 * @param {Event} e Event
 */
const preventNonNumericOnPaste = e => {
  e.persist()

  // Get pasted data via clipboard API
  const pastedData = e.clipboardData.getData('Text')

  if (!isNumeric(pastedData)) {
    e.stopPropagation()
    e.preventDefault()
  }
}

/**
 * @name IntegerInput
 */
class IntegerInput extends React.Component {
  render() {
    return <BasicInput {...this.props} pattern="[0-9]*" placeholder="0" type="number" />
  }
}

const IntegerInputAsField = compose(
  withInputValidation,
  asField
)(IntegerInput)

class WrappedIntegerInputAsField extends React.Component {
  static propTypes = {
    isDisabled: PropTypes.bool,
    isRequired: PropTypes.bool,
    max: PropTypes.number,
    min: PropTypes.number,
    validate: PropTypes.func,
  }

  validate = value => {
    const { isDisabled, isRequired, max, min } = this.props
    if (isDisabled) {
      return
    }
    try {
      let validator = yup.number().typeError('A number is required')
      if (isRequired) {
        validator = validator.required()
      }
      if (min) {
        validator = validator.min(min)
      }
      if (max) {
        validator = validator.max(max)
      }
      validator.validateSync(Number(value))
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
    return (
      <IntegerInputAsField
        {...this.props}
        mask={convertToNumber}
        onKeyDown={preventNonNumeric}
        onPaste={preventNonNumericOnPaste}
        validate={this.validate}
      />
    )
  }
}

export default WrappedIntegerInputAsField

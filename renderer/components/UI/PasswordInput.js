/* eslint-disable react/no-multi-comp */

import React from 'react'
import PropTypes from 'prop-types'
import { asField } from 'informed'
import * as yup from 'yup'
import { BasicInput } from './Input'

/**
 * @render react
 * @name PasswordInput
 */
class PasswordInput extends React.Component {
  render() {
    return <BasicInput {...this.props} type="password" />
  }
}

const PasswordInputAsField = asField(PasswordInput)

class WrappedPasswordInputAsField extends React.Component {
  static propTypes = {
    isDisabled: PropTypes.bool,
    isRequired: PropTypes.bool,
    minLength: PropTypes.number,
    validate: PropTypes.func,
  }

  static defaultProps = {
    isDisabled: false,
    isRequired: false,
    minLength: 8,
  }

  validate = value => {
    const { isDisabled, isRequired, minLength } = this.props
    if (isDisabled) {
      return
    }
    try {
      let validator = yup.string().min(minLength)
      if (isRequired) {
        validator = validator.required()
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
    return <PasswordInputAsField validate={this.validate} {...this.props} />
  }
}

export default WrappedPasswordInputAsField

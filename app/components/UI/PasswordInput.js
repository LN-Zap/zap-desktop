/* eslint-disable react/no-multi-comp */

import React from 'react'
import PropTypes from 'prop-types'
import { asField } from 'informed'
import * as yup from 'yup'
import Input from './Input'

/**
 * @render react
 * @name PasswordInput
 */
class PasswordInput extends React.Component {
  render() {
    return <Input {...this.props} type="password" />
  }
}

const PasswordInputAsField = asField(PasswordInput)

class WrappedPasswordInputAsField extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    validate: PropTypes.func
  }

  static defaultProps = {
    disabled: false,
    required: false
  }

  validate = value => {
    const { disabled, required } = this.props
    if (disabled) {
      return
    }
    try {
      let validator = yup.string().min(8)
      if (required) {
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

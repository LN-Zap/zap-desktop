/* eslint-disable react/no-multi-comp */

import React from 'react'
import { asField } from 'informed'
import * as yup from 'yup'
import Input from 'components/UI/Input'

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

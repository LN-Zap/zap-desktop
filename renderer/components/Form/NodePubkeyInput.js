import React from 'react'

import { asField } from 'informed'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import * as yup from 'yup'

import { intlShape } from '@zap/i18n'
import { Message } from 'components/UI'

import { BasicInput } from './Input'
import messages from './messages'

class NodePubkeyInput extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    isDisabled: PropTypes.bool,
    isRequired: PropTypes.bool,
    validate: PropTypes.func,
  }

  validate = value => {
    const { isDisabled, isRequired, validate } = this.props
    if (isDisabled) {
      return undefined
    }
    try {
      let validator = yup.string()
      if (isRequired) {
        validator = validator.required()
      }
      validator = validator.matches(/(.+@.+)/, 'Invalid format')

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

  render() {
    const { intl, ...rest } = this.props

    return (
      <InternalNodePubkeyInput
        placeholder={intl.formatMessage({ ...messages.pubkey_placeholder })}
        {...rest}
        type="text"
        validate={this.validate}
      />
    )
  }
}

const InternalNodePubkeyInput = ({ fieldState, fieldApi, ...rest }) => {
  const { value, error } = fieldState

  return (
    <>
      <BasicInput {...rest} fieldApi={fieldApi} fieldState={fieldState} />
      {value && !error && (
        <Message mt={2} variant="success">
          <FormattedMessage {...messages.valid_pubkey} />
        </Message>
      )}
    </>
  )
}

InternalNodePubkeyInput.propTypes = {
  fieldApi: PropTypes.object.isRequired,
  fieldState: PropTypes.object.isRequired,
}

const BasicNodePubkeyInput = injectIntl(NodePubkeyInput)
export { BasicNodePubkeyInput }

export default asField(BasicNodePubkeyInput)

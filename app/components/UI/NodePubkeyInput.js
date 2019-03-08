import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import * as yup from 'yup'
import { asField } from 'informed'
import Input from './Input'
import Message from './Message'
import messages from './messages'

/**
 * @render react
 * @name NodePubkeyInput
 */
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
      return
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
  }

  render() {
    const { intl, ...rest } = this.props

    return (
      <NodePubkeyInputAsField
        placeholder={intl.formatMessage({ ...messages.pubkey_placeholder })}
        {...rest}
        type="text"
        validate={this.validate}
      />
    )
  }
}

const NodePubkeyInputAsField = asField(({ fieldState, fieldApi, ...rest }) => {
  const { value, error } = fieldState

  return (
    <React.Fragment>
      <Input {...rest} />
      {value && !error && (
        <Message mt={2} variant="success">
          <FormattedMessage {...messages.valid_pubkey} />
        </Message>
      )}
    </React.Fragment>
  )
})

export default injectIntl(NodePubkeyInput)

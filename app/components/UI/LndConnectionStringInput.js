import React from 'react'
import PropTypes from 'prop-types'
import { intlShape, injectIntl } from 'react-intl'
import { isValidLndConnectUri, isValidBtcPayConfig } from 'lib/utils/connectionString'
import TextArea from './TextArea'
import messages from './messages'

/**
 * @render react
 * @name LndConnectionStringInput
 * @example
 * <LndConnectionStringInput
     field="testnet"
     id="testnet"
     validateOnChange
     validateOnBlur />
 */
class LndConnectionStringInput extends React.Component {
  static displayName = 'LndConnectionStringInput'

  static propTypes = {
    intl: intlShape.isRequired,
    initialValue: PropTypes.string
  }

  prettyPrint = json => {
    try {
      return JSON.stringify(JSON.parse(json), undefined, 4)
    } catch (e) {
      return json
    }
  }

  /**
   * Check for a valid lndconnect uri or BtcPayServer connection string.
   * @param  {String}  value String to validate.
   * @return {Boolean}       Boolean indicating wether the string is a valid or not.
   */
  validate = value => {
    const { intl } = this.props
    const isValid = isValidLndConnectUri(value) || isValidBtcPayConfig(value)
    if (!isValid) {
      return intl.formatMessage({ ...messages.invalid_lnd_connection_string })
    }
  }

  render() {
    let { initialValue, intl, ...rest } = this.props

    if (initialValue) {
      initialValue = this.prettyPrint(initialValue)
    }

    return (
      <TextArea
        placeholder={intl.formatMessage({ ...messages.lnd_connection_string_placeholder })}
        css={{ 'word-break': 'break-all' }}
        initialValue={initialValue}
        {...rest}
        spellCheck="false"
        validate={this.validate}
      />
    )
  }
}

export default injectIntl(LndConnectionStringInput)

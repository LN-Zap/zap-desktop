import React from 'react'

import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'

import { intlShape } from '@zap/i18n'
import { isValidLndConnectUri, isValidBtcPayConfig } from '@zap/utils/connectionString'

import messages from './messages'
import TextArea from './TextArea'

const mask = value => value && value.trim()

class LndConnectionStringInput extends React.Component {
  static displayName = 'LndConnectionStringInput'

  static propTypes = {
    initialValue: PropTypes.string,
    intl: intlShape.isRequired,
  }

  prettyPrint = json => {
    try {
      return JSON.stringify(JSON.parse(json), undefined, 4)
    } catch (e) {
      return json
    }
  }

  /**
   * validate - Check for a valid lndconnect uri or BtcPayServer connection string.
   *
   * @param {string}  value String to validate.
   * @returns {boolean}       Boolean indicating whether the string is a valid or not.
   */
  validate = value => {
    const { intl } = this.props
    const isValid = isValidLndConnectUri(value) || isValidBtcPayConfig(value)
    if (!isValid) {
      return intl.formatMessage({ ...messages.invalid_lnd_connection_string })
    }
    return undefined
  }

  render() {
    const { initialValue, intl, ...rest } = this.props
    const formattedInitialValue = initialValue ? this.prettyPrint(initialValue) : null

    return (
      <TextArea
        css="word-break: break-all;"
        initialValue={formattedInitialValue}
        mask={mask}
        placeholder={intl.formatMessage({ ...messages.lnd_connection_string_placeholder })}
        rows={5}
        {...rest}
        spellCheck="false"
        validate={this.validate}
      />
    )
  }
}

export default injectIntl(LndConnectionStringInput)

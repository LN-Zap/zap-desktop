import React from 'react'

import { withFieldState } from 'informed'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { compose } from 'redux'

import { Text } from 'components/UI'

import messages from './messages'

const AutopayStatus = ({ fieldState, ...rest }) => (
  <Text {...rest}>
    <FormattedMessage
      {...(fieldState && fieldState.value
        ? messages.autopay_status_active
        : messages.autopay_status_inactive)}
    />
  </Text>
)

AutopayStatus.propTypes = {
  fieldState: PropTypes.object.isRequired,
}

export default compose(withFieldState('isEnabled'), injectIntl)(AutopayStatus)

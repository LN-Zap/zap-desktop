import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { withFieldState } from 'informed'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Text } from 'components/UI'
import messages from './messages'

const AutopayStatus = ({ fieldState }) => (
  <Text>
    {
      <FormattedMessage
        {...(fieldState && fieldState.value
          ? messages.autopay_status_active
          : messages.autopay_status_inactive)}
      />
    }
  </Text>
)

AutopayStatus.propTypes = {
  fieldState: PropTypes.object.isRequired,
}

export default compose(
  withFieldState('isEnabled'),
  injectIntl
)(AutopayStatus)

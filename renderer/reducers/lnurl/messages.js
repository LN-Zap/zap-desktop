import { defineMessages } from 'react-intl'

// use pattern [reducer]_message

/* eslint-disable max-len */
export default defineMessages({
  lnurl_auth_error: 'Unable to authenticate with {service}: {reason}',
  lnurl_auth_success: 'Successfully authenticated with {service}',
  lnurl_channel_started: 'Incoming channel requested. Please wait…',
  lnurl_channel_error: 'Unable to request incoming channel from {service}: {reason}',
  lnurl_channel_success: 'Channel request from {service} accepted',
  lnurl_withdraw_started: 'Withdrawal requested. Please wait…',
  lnurl_withdraw_error: 'Unable to process withdrawal request from {service}: {reason}',
  lnurl_withdraw_success: 'Withdrawal request from {service} complete',
})

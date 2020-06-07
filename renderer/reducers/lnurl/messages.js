import { defineMessages } from 'react-intl'

// use pattern [reducer]_message

/* eslint-disable max-len */
export default defineMessages({
  lnurl_auth_error: 'Unable to authenticate with {service}: {reason}',
  lnurl_auth_success: 'Successfully authenticated with {service}',
  lnurl_channel_open_warning: 'Channel opening initiated',
  lnurl_channel_started: 'Incoming channel requested. Please wait…',
  lnurl_channel_error: 'Unable to request incoming channel from {service}: {reason}',
  lnurl_channel_success: 'Channel request from {service} accepted',
})

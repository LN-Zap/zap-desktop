import { defineMessages } from 'react-intl'

// use pattern [reducer]_message

/* eslint-disable max-len */
export default defineMessages({
  channels_open_warning: 'Channel opening initiated',
  channels_lnurl_channel_started: 'Incoming channel requested. Please wait…',
  channels_lnurl_channel_error: 'Unable to request incoming channel from {service}: {reason}',
  channels_lnurl_channel_success: 'Channel request from {service} accepted',
})

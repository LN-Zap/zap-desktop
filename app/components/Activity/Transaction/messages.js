import { defineMessages } from 'react-intl'

/* eslint-disable max-len */
export default defineMessages({
  received: 'Received',
  sent: 'Sent',
  funding: 'Channel Funding',
  closing: 'Channel Closing',
  amount: 'Transaction amount',
  fee: 'Transaction fee',
  type: 'On-chain transaction',
  status_processing: 'Processing your transaction...',
  status_success: 'Your transaction was successful.',
  status_error: 'There was a problem sending your transaction.',
  closetype_cooperative_close: 'Cooperative close',
  closetype_local_force_close: 'Local force close',
  closetype_remote_force_close: 'Remote force close',
  closetype_breach_close: 'Breach',
  closetype_funding_canceled: 'Funding Canceled',
  closetype_abandoned: 'Abandoned',
})

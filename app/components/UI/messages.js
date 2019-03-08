import { defineMessages } from 'react-intl'

/* eslint-disable max-len */
export default defineMessages({
  amount: 'Amount',
  expires: 'Expires',
  expired: 'Expired',
  help: 'Need Help?',
  required_field: 'This is a required field',
  invalid_request: 'Not a valid {chain} request.',
  valid_request: 'Valid {chain} request',
  valid_pubkey: 'Valid PubKey',
  invalid_lnd_connection_string: 'Not a valid connection string',
  payreq_placeholder: 'Paste a Lightning Payment Request or {chain} Address here',
  pubkey_placeholder: 'pubkey@host:port',
  lnd_connection_string_placeholder: 'Paste an Lnd Connect URI or BTCPay Server config here',
})

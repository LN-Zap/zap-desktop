import { defineMessages } from 'react-intl'

/* eslint-disable max-len */
export default defineMessages({
  amount: 'Amount',
  calculating: 'calculating',
  expires: 'Expires',
  expired: 'Expired',
  fee: 'Fee',
  fee_unknown: 'unknown',
  fee_per_byte: 'per byte',
  required_field: 'This is a required field',
  invalid_request: 'Not a valid {chain} request.',
  valid_request: 'Valid {chain} request',
  valid_pubkey: 'Valid PubKey',
  invalid_lnd_connection_string: 'Not a valid connection string',
  payreq_placeholder: 'Paste a Lightning Payment Request or {chain} Address here',
  pubkey_placeholder: 'pubkey@host:port',
  lnd_connection_string_placeholder: 'Paste an Lnd Connect URI or BTCPay Server config here',
  transaction_speed_slow: 'Slow',
  transaction_speed_slow_description: 'Estimated Delivery: 1-24 hours',
  transaction_speed_medium: 'Medium',
  transaction_speed_medium_description: 'Estimated Delivery: 1-6 hours',
  transaction_speed_fast: 'Fast',
  transaction_speed_fast_description: 'Estimated Delivery: less than 1 hour',
})

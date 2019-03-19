import { defineMessages } from 'react-intl'

/* eslint-disable max-len */
export default defineMessages({
  calculating: 'calculating',
  current_balance: 'Your current balance',
  error_not_enough_funds: 'You do not have enough funds available to make this payment.',
  request_label_combined: 'Payment Request or Address',
  request_label_offchain: 'Payment Request',
  request_label_onchain: 'Address',
  searching_routes: 'searching for routes',
  subtitle_onchain: 'On-Chain Payment',
  subtitle_offchain: 'Lightning Payment',
  next_block_confirmation: 'next block confirmation',
  next: 'Next',
  back: 'Back',
  send: 'Send',
  fee: 'Fee',
  fee_less_than_1: 'less than 1 satoshi',
  fee_range: 'between {minFee} and {maxFee} satoshis',
  fee_upto: 'up to {maxFee} satoshi',
  fee_unknown: 'unknown',
  fee_per_byte: 'per byte',
  amount: 'Amount',
  total: 'Total',
  memo: 'Memo',
  description:
    'You can send {chain} ({ticker}) through the Lightning Network or make a On-Chain Transaction. Just paste your Lightning Payment Request or the {chain} Address in the field below. Zap will guide you to the process.',
})

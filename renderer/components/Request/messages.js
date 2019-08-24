import { defineMessages } from 'react-intl'

/* eslint-disable max-len */
export default defineMessages({
  amount: 'Amount',
  created: 'Created',
  current_value: 'Current value',
  button_text: 'Request',
  copy_button_text: 'Copy invoice',
  address_copied_notification_title: 'Address copied',
  address_copied_notification_description: 'Payment request has been copied to your clipboard',
  payment_request: 'Payment request',
  total: 'Total',
  memo: 'Memo',
  fallback_address: 'Fallback address',
  memo_placeholder: 'For example "Dinner last night"',
  add_error: 'An error has occurred',
  routing_hints_label: 'Include routing hints',
  routing_hints_tooltip: 'Whether this invoice should include routing hints for private channels.',
  memo_tooltip:
    'Add some describer text to your payment request for the recipient to see when paying.',
  not_paid: 'not paid',
  paid: 'paid',
  qrcode: 'QR-Code',
  status: 'Request Status',
  title: 'Receive',
  description:
    'Zap will generate a QR-Code and a lightning invoice so that you can receive {chain} ({ticker}) through the Lightning Network.',
  expires: 'Expires',
  expired: 'Expired',
})

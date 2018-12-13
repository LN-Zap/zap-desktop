import { defineMessages } from 'react-intl'

/* eslint-disable max-len */
export default defineMessages({
  amount: 'Amount',
  button_text: 'Request',
  copy_button_text: 'Copy invoice',
  address_copied_notification_title: 'Address copied',
  address_copied_notification_description: 'Payment address has been copied to your clipboard',
  ln_invoice: 'Lightning Invoice',
  total: 'Total',
  memo: 'Memo',
  memo_placeholder: 'For example "Dinner last night"',
  not_paid: 'not paid',
  paid: 'paid',
  qrcode: 'QR-Code',
  status: 'Request Status',
  title: 'Request',
  subtitle: 'through the Lightning Network',
  description:
    'You can request {chain} ({ticker}) through the Lightning Network. Just enter the Amount you want to request in the field below. Zap will generate a QR-Code and a Lightning invoice after.'
})

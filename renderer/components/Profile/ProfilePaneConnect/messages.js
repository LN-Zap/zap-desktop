import { defineMessages } from 'react-intl'

/* eslint-disable max-len */
export default defineMessages({
  connect_pane_title: 'Connect',
  copy_lndconnect: 'Copy Lndconnect',
  lndconnect_copied_notification_description: 'Node URI key has been copied to your clipboard',
  lndconnect_description:
    'This QR Code can be used to connect other devices to your lnd node. It can be used with Zap iOS and Zap Android and any other wallet that supports the lndconnect standard.',
  lndconnect_warning:
    'Keep this private! If someone gains access to this QR Code they can steal your money.',
  lndconnect_reveal_button: 'Click to reveal QR Code',
  lndconnect_hide_button: 'Click to hide QR Code',
  lndconnect_title: 'LndConnect QR Code',
})

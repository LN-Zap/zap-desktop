import { defineMessages } from 'react-intl'

export default defineMessages({
  node_public_key: 'Node Public Key',
  node_pubkey: 'Node Pubkey',
  lndconnect_uri: 'LndConnect',
  wallet_address: '{chain} Address',
  copy: 'Copy',
  copy_address: 'Copy address',
  copy_pubkey: 'Copy Pubkey',
  copy_uri: 'Copy URI',
  address_copied_notification_title: 'Address copied',
  address_copied_notification_description: 'Address has been copied to your clipboard',
  pubkey_copied_notification_title: 'Node public key copied',
  pubkey_copied_notification_description: 'Node public key has been copied to your clipboard',
  lndconnect_copied_notification_title: 'Node URI copied',
  lndconnect_copied_notification_description: 'Node URI key has been copied to your clipboard',
  lndconnect_warning:
    'Keep this private! If someone gains access to this QR Code they can steal your money.',
  lndconnect_reveal_button: 'Click to reveal QR Code',
  lndconnect_hide_button: 'Click to hide QR Code',
})

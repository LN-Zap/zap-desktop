import { defineMessages } from 'react-intl'

/* eslint-disable max-len */
export default defineMessages({
  sign_message_pane_title: 'Sign Message',
  feature_desc: `Sign arbitrary messages to prove that you are in control of the node's public key. Signed message can be independently verified by the people you hand the message to.`,
  sign_message_label: `Message`,
  sign_message_desc: `Message to sign with node's private key.`,
  sign_message_action: 'Sign',
  copy_signature: 'Copy signature to clipboard',
  signature: 'Signature',
  sign_error: `Can't create signature`,
  sig_copied_notification_description: 'Signature has been copied to your clipboard',
})

import { defineMessages } from 'react-intl'

/* eslint-disable max-len */
export default defineMessages({
  verify_pane_title: 'Verify Message',
  feature_desc: `Verify a signature over a message. The signature must be zbase32 encoded and signed
  by an active node in the resident node's channel database. In addition to returning the
  validity of the signature, recovered pubkey from the signature is displayed.`,
  verify_message_label: 'Message',
  verify_message_desc: 'Enter a message that you would like to verify the authenticity of.',
  message_to_verify: 'Message to verify',
  verify_message_action: 'Verify',
  verify_signature_label: 'Signature',
  verify_signature_desc: 'The signature to be verified over the given message.',
  verification: 'Verification details',
  sign_error: `Can't create signature`,
  pubkey_hint: `Copy public key to clipboard`,
  signature_status_valid: 'Signature is valid. Signer pubkey recovered from the signature:',
  signature_status_error: `Unable to verify the signature. Signature may be incorrect or signer is not in the node's channel database.`,
  pubkey_copied_notification_description: 'Pubkey has been copied to your clipboard',
})

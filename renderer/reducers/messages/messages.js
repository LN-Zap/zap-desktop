import { defineMessages } from 'react-intl'

// use pattern [reducer]_message

/* eslint-disable max-len */
export default defineMessages({
  autopay_notification_title: 'Autopay invoice for {amount} satoshis',
  autopay_notification_message: 'Paying {amount} satoshis to {pubkey}',
  autopay_notification_detail: 'for "{reason}"',
  backup_import_success: 'Wallet backup imported successfully',
  backup_import_error: 'Backup import has failed: {error} ',
  backup_not_found_error: 'Unable to find backup file ',
  address_new_address_error: 'Unable to get {addressType} address: {error}',
  settings_init_error: 'Unable to load settings: {error}',
  invoice_receive_title: `You've been Zapped`,
  invoice_receive_body: 'Congrats, someone just paid an invoice of yours',
  keysend_receive_body: 'Congrats, someone just paid you',
  app_init_db_error: 'Unable to initialize database: {error}',
  transaction_received_title: 'On-chain Transaction Received!',
  transaction_received_body: `Lucky you, you just received a new on-chain transaction. I'm jealous.`,
  transaction_sent_title: 'On-chain Transaction Sent!',
  transaction_sent_body: `Hate to see 'em go but love to watch 'em leave. Your on-chain transaction successfully sent.`,
  neutrtino_synced_title: 'Lightning Node Synced',
  neutrtino_synced_body: "Visa who? You're your own payment processor now!",
})

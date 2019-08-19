import { defineMessages } from 'react-intl'

// use pattern [reducer]_message

/* eslint-disable max-len */
export default defineMessages({
  backup_import_success: 'Wallet backup imported successfully',
  backup_import_error: 'Backup import has failed: {error} ',
  backup_not_found_error: 'Unable to find backup file ',
  address_new_address_error: 'Unable to get {addressType} address: {error}',
  settings_init_error: 'Unable to load settings: {error}',
  payment_send_error: 'Unable to send payment: Invalid invoice (no payment hash)',
  channels_open_warning: 'Channel opening initiated',
  activity_invoice_download_error: 'An error has occurred',
  activity_invoice_download_success: 'Download Complete',
})

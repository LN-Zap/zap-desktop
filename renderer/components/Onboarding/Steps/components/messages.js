import { defineMessages } from 'react-intl'

/* eslint-disable max-len */
export default defineMessages({
  skip_backup_dialog_warning:
    'Not setting up your channel backup means the file will only live locally in your Zap data directory. If this file is damaged or lost, it can lead to loss of funds in the event that you need to restore from seed.',
  skip_backup_dialog_restore_warning:
    'Recovering a wallet without your channel backup file can lead to loss of funds in the event that you need to restore from seed.',
  skip_backup_dialog_warning_skip_text: 'Skip',
  skip_backup_dialog_warning_cancel_text: 'Cancel',
  skip_backup_dialog_warning_header: 'Are you sure?',
  skip_backup_dialog_warning_acknowledgement: 'I do not want to set up my channel backup',
  skip_backup_dialog_restore_warning_acknowledgement: 'I do not want to recover channel funds',
  error_dialog_header: 'An error has occurred',
  error_dialog_create_wallet_error_desc: 'The following error has ocurred when creating a wallet:',
  error_dialog_recover_wallet_error_desc:
    'The following error has occurred when recovering a wallet:',
  error_dialog_close_text: 'Close',
})

import { defineMessages } from 'react-intl'

/* eslint-disable max-len */
export default defineMessages({
  intro: 'Enter your password to continue.',
  header: 'Secure storage is not available',
  error_desc_win32: `Windows Credential Manager is not available. It is required to start Zap wallet.`,
  error_desc_linux: `Gnome Keyring is not available. It might not be installed or the process is not running. Please ensure it's installed and running and restart the app`,
  error_desc_darwin: `Mac OS Keychain is not available. It is required to start Zap wallet.`,
})

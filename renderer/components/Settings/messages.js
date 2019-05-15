import { defineMessages } from 'react-intl'

/* eslint-disable max-len */
export default defineMessages({
  settings_title: 'Settings',
  settings_subtitle: 'Global settings',
  save: 'Save',
  cancel: 'Cancel',
  submit_success: 'Settings have been updated.',
  autoupdate_active_label: 'Autoupdate',
  autoupdate_active_description: 'Automatically download and install updates.',
  locale_label: 'Language',
  locale_description: 'Your preferred language.',
  currency_label: 'Fiat currency',
  currency_description: 'Your preferred fiat currency.',
  theme_label: 'Theme',
  theme_description: 'Your preferred display mode.',
  theme_option_light: 'Light',
  theme_option_dark: 'Dark',
  address_label: 'Address format',
  address_description: 'Your preferred receiving address format.',
  address_option_p2wkh: 'Bech32',
  address_option_np2wkh: 'Segwit',
  lndTargetConfirmations_slow_label: 'Target confirmations (slow)',
  lndTargetConfirmations_slow_description: 'Number of blocks to target for "slow" sending speed.',
  lndTargetConfirmations_medium_label: 'Target confirmations (medium)',
  lndTargetConfirmations_medium_description:
    'Number of blocks to target for "medium" sending speed.',
  lndTargetConfirmations_fast_label: 'Target confirmations (fast)',
  lndTargetConfirmations_fast_description: 'Number of blocks to target for "fast" sending speed.',
})

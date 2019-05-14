import { defineMessages } from 'react-intl'

/* eslint-disable max-len */
export default defineMessages({
  enable: 'Enable',
  disable: 'Disable',
  save: 'Save',
  cancel: 'Cancel',
  autoupdate_active_label: 'Autoupdate',
  autoupdate_active_description: 'Enable to disable autoupdates.',
  locale_label: 'Language',
  locale_description: 'Language the app will display in.',
  locale_option_en: 'English',
  locale_option_es: 'Spanish',
  currency_label: 'Fiat currency',
  currency_description: 'Currency to use when display fiat amounts.',
  currency_option_usd: 'USD',
  currency_option_gbp: 'GBP',
  blockexplorer_label: 'Block explorer',
  blockexplorer_description: 'Used when linking to transaction detail.',
  theme_label: 'Theme',
  theme_description: 'Your preferred display mode.',
  theme_option_light: 'Light',
  theme_option_dark: 'Dark',
  address_label: 'Address format',
  address_description: 'Your preferred address format.',
  address_option_p2wkh: 'Bech 32',
  address_option_np2wkh: 'Wrapped Bech 32',
  lndTargetConfirmations_hourConfCount_label: 'Target confs (slow)',
  lndTargetConfirmations_hourConfCount_description:
    'Number of blocks to target for "slow" transactions',
  lndTargetConfirmations_halfHourConfCount_label: 'Target confs (medium)',
  lndTargetConfirmations_halfHourConfCount_description:
    'Number of blocks to target for "medium" transactions',
  lndTargetConfirmations_fastestConfCount_label: 'Target confs (fast)',
  lndTargetConfirmations_fastestConfCount_description:
    'Number of blocks to target for "fast" transactions',
})

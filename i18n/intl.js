// Provides support of intl outside of the React context

import jstz from 'jstimezonedetect'
import { createIntl, createIntlCache } from 'react-intl'

import translations from '@zap/i18n/translation'

/**
 * createIntlObj - Creates intl object using `locale`.
 *
 * @param {string} locale locale
 * @returns {object} IntlShape object
 */
function createIntlObj(locale) {
  // This is optional but highly recommended
  // since it prevents memory leak
  const cache = createIntlCache()
  return createIntl(
    {
      locale,
      messages: translations[locale],
      timeZone: jstz.determine().name(),
    },
    cache
  )
}

let intl = createIntlObj('en')

/**
 * setIntlLocale - Set current locale.
 *
 * @param {string} locale locale
 */
export function setIntlLocale(locale) {
  intl = createIntlObj(locale)
}

/**
 * getIntl - Get current intl object.
 *
 * @returns {object} IntlShape object
 */
export function getIntl() {
  return intl
}

import { lookup } from 'country-data-lookup'
import createDebug from 'debug'
import isRenderer from 'is-electron-renderer'
import get from 'lodash/get'
import PropTypes from 'prop-types'

export { getIntl, setIntlLocale } from './intl'

export const intlShape = PropTypes.instanceOf(Object)

// Define list of language that we will support.
export const locales = [
  'bg',
  'cs',
  'de',
  'el',
  'en',
  'es',
  'fr',
  'ga',
  'hr',
  'ja',
  'nl',
  'pt',
  'ro',
  'ru',
  'sv',
  'tr',
  'uk',
  'zh-CN',
  'zh-TW',
]

// Define list of currencies that we will support.
export const currencies = [
  'USD',
  'EUR',
  'JPY',
  'GBP',
  'CAD',
  'KRW',
  'AUD',
  'BRL',
  'CHF',
  'CLP',
  'CNY',
  'DKK',
  'HKD',
  'INR',
  'ISK',
  'NZD',
  'PLN',
  'RUB',
  'SEK',
  'SGD',
  'THB',
  'TWB',
  'UAH',
]

/**
 * Debugger that does not log in the renderer process.
 */
const debuger = createDebug('zap:i18n')
const debug = (...args) => {
  if (!isRenderer) {
    debuger(args)
  }
}

/**
 * getDefaultLocale - Get the most appropriate language code.
 *
 * @returns {string} Language code
 */
export const getDefaultLocale = () => {
  const defaultLocale = window.navigator.language || 'en-US'
  const language = defaultLocale.toLowerCase().split(/[_-]+/)[0]
  let locale = 'en'
  if (locales.includes(language)) {
    locale = language
  }
  if (locales.includes(defaultLocale)) {
    locale = defaultLocale
  }
  debug('Determined locale as %s', locale)
  return locale
}

/**
 * getLanguageName - Get the most appropriate language code.
 *
 * @param {string} lang Language code
 * @returns {string} Language name
 */
export const getLanguageName = lang => {
  const customNames = {
    el: 'Greek',
    'zh-CN': 'Chinese (Simplified, PRC)',
    'zh-TW': 'Chinese (Traditional, Taiwan)',
  }
  if (customNames[lang]) {
    return customNames[lang]
  }

  const language = lang.toLowerCase().split(/[_-]+/)[0]
  const data = lookup.languages({ alpha2: language })
  const name = get(data, '[0]name', language)
  debug('Determined language as %s', name)
  return name
}

/**
 * getDefaultCurrency - Get the most appropriate currency code.
 *
 * @returns {string} Currency code.
 */
export const getDefaultCurrency = () => {
  const defaultLocale = getDefaultLocale()
  const country = defaultLocale.split(/[_-]+/)[1]
  const data = lookup.countries({ alpha2: country })
  const detectedCurrency = get(data, '[0]currencies[0]', 'USD')
  let currency = 'USD'
  if (currencies.includes(detectedCurrency)) {
    currency = detectedCurrency
  }
  debug('Determined currency as %s', currency)
  return currency
}

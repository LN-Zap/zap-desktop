import { app, remote } from 'electron'
import { addLocaleData } from 'react-intl'
import Store from 'electron-store'
import get from 'lodash.get'
import { lookup } from 'country-data-lookup'
import createDebug from 'debug'
import isRenderer from 'is-electron-renderer'

// Load locale data.
import bg from 'react-intl/locale-data/bg'
import cs from 'react-intl/locale-data/cs'
import de from 'react-intl/locale-data/de'
import el from 'react-intl/locale-data/el'
import en from 'react-intl/locale-data/en'
import es from 'react-intl/locale-data/es'
import fr from 'react-intl/locale-data/fr'
import ga from 'react-intl/locale-data/ga'
import hr from 'react-intl/locale-data/hr'
import ja from 'react-intl/locale-data/ja'
import nl from 'react-intl/locale-data/nl'
import pt from 'react-intl/locale-data/pt'
import ro from 'react-intl/locale-data/ro'
import ru from 'react-intl/locale-data/ru'
import sv from 'react-intl/locale-data/sv'
import tr from 'react-intl/locale-data/tr'
import uk from 'react-intl/locale-data/uk'
import zh from 'react-intl/locale-data/zh'

// Load translation data.
import bgTranslationMessages from '../../translations/bg-BG.json'
import csTranslationMessages from '../../translations/cs-CZ.json'
import deTranslationMessages from '../../translations/de-DE.json'
import elTranslationMessages from '../../translations/el-GR.json'
import enTranslationMessages from '../../translations/en.json'
import esTranslationMessages from '../../translations/es-ES.json'
import frTranslationMessages from '../../translations/fr-FR.json'
import gaTranslationMessages from '../../translations/ga-IE.json'
import hrTranslationMessages from '../../translations/hr-HR.json'
import jaTranslationMessages from '../../translations/ja-JP.json'
import nlTranslationMessages from '../../translations/nl-NL.json'
import ptTranslationMessages from '../../translations/pt-BR.json'
import roTranslationMessages from '../../translations/ro-RO.json'
import ruTranslationMessages from '../../translations/ru-RU.json'
import svTranslationMessages from '../../translations/sv-SE.json'
import trTranslationMessages from '../../translations/tr-TR.json'
import ukTranslationMessages from '../../translations/uk-UA.json'
import zhCNTranslationMessages from '../../translations/zh-CN.json'
import zhTWTranslationMessages from '../../translations/zh-TW.json'

/**
 * Debugger that does not log in the renderer process.
 */
const debuger = createDebug('zap:i18n')
const debug = (...args) => {
  if (!isRenderer) {
    debuger(args)
  }
}

// Add locale data.
addLocaleData([
  ...bg,
  ...cs,
  ...de,
  ...el,
  ...en,
  ...es,
  ...fr,
  ...ga,
  ...hr,
  ...ja,
  ...nl,
  ...pt,
  ...ro,
  ...ru,
  ...sv,
  ...tr,
  ...uk,
  ...zh
])

// Defaine list of language that we will support.
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
  'zh-TW'
]

// Defaine list of currencies that we will support.
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
  'TWB'
]

// Collate all translations.
export const translationMessages = {
  en: enTranslationMessages,
  bg: bgTranslationMessages,
  'zh-CN': zhCNTranslationMessages,
  'zh-TW': zhTWTranslationMessages,
  hr: hrTranslationMessages,
  cs: csTranslationMessages,
  nl: nlTranslationMessages,
  fr: frTranslationMessages,
  ga: gaTranslationMessages,
  de: deTranslationMessages,
  el: elTranslationMessages,
  ja: jaTranslationMessages,
  pt: ptTranslationMessages,
  ro: roTranslationMessages,
  ru: ruTranslationMessages,
  es: esTranslationMessages,
  sv: svTranslationMessages,
  tr: trTranslationMessages,
  uk: ukTranslationMessages
}

/**
 * Get the most appropriate language code.
 * @return {string} Language code.
 */
export const getLocale = () => {
  const store = new Store({ name: 'settings' })
  const userLocale = store.get('locale')
  if (userLocale) {
    debug('locale as %s from settings', userLocale)
    return userLocale
  }
  const defaultLocale = (app || remote.app).getLocale() || 'en-US'
  const language = defaultLocale.toLowerCase().split(/[_-]+/)[0]
  let locale = 'en'
  if (locales.includes(language)) {
    locale = language
  }
  if (locales.includes(defaultLocale)) {
    locale = userLocale
  }
  debug('Determined locale as %s', locale)
  return locale
}

/**
 * Get the most appropriate language code.
 * @return {string} Language code.
 */
export const getLanguageName = lang => {
  const customNames = {
    el: 'Greek',
    'zh-CN': 'Chinese (Simplified, PRC)',
    'zh-TW': 'Chinese (Traditional, Taiwan)'
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
 * Get the most appropriate currency code.
 * @return {string} Currency code.
 */
export const getCurrency = () => {
  const store = new Store({ name: 'settings' })
  const userCurrency = store.get('fiatTicker')
  if (userCurrency) {
    debug('Determined currency as %s from settings', userCurrency)
    return userCurrency
  }
  const defaultLocale = (app || remote.app).getLocale() || 'en-US'
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

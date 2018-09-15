import { app, remote } from 'electron'
import { addLocaleData } from 'react-intl'

// Load locale data.
import bg from 'react-intl/locale-data/bg'
import cs from 'react-intl/locale-data/cs'
import de from 'react-intl/locale-data/de'
import el from 'react-intl/locale-data/el'
import en from 'react-intl/locale-data/en'
import es from 'react-intl/locale-data/es'
import fr from 'react-intl/locale-data/fr'
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
import bgTranslationMessages from './translations/bg-BG.json'
import csTranslationMessages from './translations/cs-CZ.json'
import deTranslationMessages from './translations/de-DE.json'
import elTranslationMessages from './translations/el-GR.json'
import enTranslationMessages from './translations/en.json'
import esTranslationMessages from './translations/es-ES.json'
import frTranslationMessages from './translations/fr-FR.json'
import hrTranslationMessages from './translations/hr-HR.json'
import jaTranslationMessages from './translations/ja-JP.json'
import nlTranslationMessages from './translations/nl-NL.json'
import ptTranslationMessages from './translations/pt-BR.json'
import roTranslationMessages from './translations/ro-RO.json'
import ruTranslationMessages from './translations/ru-RU.json'
import svTranslationMessages from './translations/sv-SE.json'
import trTranslationMessages from './translations/tr-TR.json'
import ukTranslationMessages from './translations/uk-UA.json'
import zhTranslationMessages from './translations/zh-TW.json'

// Add locale data.
addLocaleData([
  ...bg,
  ...cs,
  ...de,
  ...el,
  ...en,
  ...es,
  ...fr,
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
export const appLocales = [
  'bg',
  'cs',
  'de',
  'el',
  'en',
  'es',
  'fr',
  'hr',
  'ja',
  'nl',
  'pt',
  'ro',
  'ru',
  'sv',
  'tr',
  'uk',
  'zh'
]

function getDefaltLocale() {
  // Detect user language.
  let language = (app || remote.app).getLocale()

  // If the detected language is not available, strip out any regional component and check again.
  if (!appLocales.includes(language)) {
    language = language.toLowerCase().split(/[_-]+/)[0]
  }
  // If we still can't find the users language, default to english.
  if (!appLocales.includes(language)) {
    language = 'en'
  }
  return language
}

export const DEFAULT_LOCALE = getDefaltLocale()

// Collate all translations.
export const translationMessages = {
  en: enTranslationMessages,
  bg: bgTranslationMessages,
  zh: zhTranslationMessages,
  hr: hrTranslationMessages,
  cs: csTranslationMessages,
  nl: nlTranslationMessages,
  fr: frTranslationMessages,
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

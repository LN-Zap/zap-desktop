import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-intl-redux'
import jstz from 'jstimezonedetect'
import { configureStore, history } from './store/configureStore'
import { getDefaultLocale } from './lib/i18n'
import Root from './containers/Root'
import { getDb } from './store/db'
import { getDbName } from './lib/utils/db'

// Register supported locales.
import './lib/i18n/locale'

// Get translations.
import translations from './lib/i18n/translation'

// Make the db globally accessible.
window.db = getDb(getDbName(CONFIG))

// Initialise the database.
window.db.open()

// Default the locale to English.
const defaultLocale = getDefaultLocale()

// Initialise the intl store with data from the users current locale.
const initialState = {
  intl: {
    locale: defaultLocale,
    messages: translations[defaultLocale],
    timeZone: jstz.determine().name()
  }
}

// Set up the redux store.
const store = configureStore(initialState)
const MOUNT_NODE = document.getElementById('root')

const render = Component => {
  ReactDOM.render(
    <Provider store={store}>
      <Component history={history} />
    </Provider>,
    MOUNT_NODE
  )
}

render(Root)

if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    render(Root)
  })
}

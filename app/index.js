import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-intl-redux'
import jstz from 'jstimezonedetect'
import { configureStore, history } from './store/configureStore'
import { getLocale } from './lib/i18n'
import Root from './containers/Root'
import './styles/app.global.scss'

// Register supported locales.
import './lib/i18n/locale'

// Get translations.
import translations from './lib/i18n/translation'

// Determine the users current locale.
const locale = getLocale()

// Initialise the intl store with data from the users current locale.
const initialState = {
  intl: {
    locale,
    messages: translations[locale],
    timeZone: jstz.determine().name()
  }
}

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

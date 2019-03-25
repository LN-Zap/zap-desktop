import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-intl-redux'
import jstz from 'jstimezonedetect'
import '@zap/i18n/locale'
import translations from '@zap/i18n/translation'
import { getDefaultLocale } from '@zap/i18n'
import { configureStore, history } from './store/configureStore'
import Root from './containers/Root'

// Default the locale to English.
const defaultLocale = getDefaultLocale()

// Initialise the intl store with data from the users current locale.
const initialState = {
  intl: {
    locale: defaultLocale,
    messages: translations[defaultLocale],
    timeZone: jstz.determine().name(),
  },
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

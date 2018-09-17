import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-intl-redux'
import jstz from 'jstimezonedetect'

import Root from './containers/Root'
import { configureStore, history } from './store/configureStore'
import './styles/app.global.scss'

import { translationMessages, DEFAULT_LOCALE } from './lib/utils/i18n'

const initialState = {
  intl: {
    locale: DEFAULT_LOCALE,
    messages: translationMessages[DEFAULT_LOCALE],
    timeZone: jstz.determine().name()
  }
}

const store = configureStore(initialState)
const MOUNT_NODE = document.getElementById('root')

const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <Root history={history} />
    </Provider>,
    MOUNT_NODE
  )
}

render()

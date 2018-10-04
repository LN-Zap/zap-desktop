import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-intl-redux'
import jstz from 'jstimezonedetect'
import { configureStore, history } from './store/configureStore'
import Root from './containers/Root'
import './styles/app.global.scss'

import { translationMessages, getLocale } from './lib/utils/i18n'

const locale = getLocale()
const initialState = {
  intl: {
    locale,
    messages: translationMessages[locale],
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

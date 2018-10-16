import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-intl-redux'
import jstz from 'jstimezonedetect'

import Root from './containers/Root'
import { configureStore, history } from './store/configureStore'
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

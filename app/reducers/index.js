// @flow
import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import ticker from './ticker'
import info from './info'
import balance from './balance'
import payment from './payment'
import peers from './peers'
import channels from './channels'
import form from './form'
import invoice from './invoice'

const rootReducer = combineReducers({
  router,
  ticker,
  info,
  balance,
  payment,
  peers,
  channels,
  form,
  invoice
})

export default rootReducer

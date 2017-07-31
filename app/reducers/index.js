// @flow
import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import ticker from './ticker'
import info from './info'
import balance from './balance'
import payment from './payment'
import peers from './peers'
import form from './form'
import invoice from './invoice'
import activity from './activity'

const rootReducer = combineReducers({
  router,
  ticker,
  info,
  balance,
  payment,
  peers,
  form,
  invoice,
  activity
})

export default rootReducer

// @flow
import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import ticker from './ticker'
import info from './info'
import balance from './balance'
import payment from './payment'
import peers from './peers'
import activity from './activity'

const rootReducer = combineReducers({
  router,
  ticker,
  info,
  balance,
  payment,
  peers,
  activity
})

export default rootReducer

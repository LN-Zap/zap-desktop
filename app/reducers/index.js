// @flow
import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import ticker from './ticker'
import info from './info'
import balance from './balance'
import activity from './activity'

const rootReducer = combineReducers({
  router,
  ticker,
  info,
  balance,
  activity
})

export default rootReducer

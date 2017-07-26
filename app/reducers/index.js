// @flow
import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import activity from './activity'

const rootReducer = combineReducers({
  router,
  activity
})

export default rootReducer

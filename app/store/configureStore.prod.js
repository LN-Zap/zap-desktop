import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { createBrowserHistory } from 'history'
import { routerMiddleware } from 'react-router-redux'
import rootReducer from '../reducers'
import ipc from '../reducers/ipc'

export const history = createBrowserHistory({ basename: window.location.pathname })

export function configureStore(initialState) {
  const middleware = []
  const enhancers = []

  middleware.push(thunk)

  const router = routerMiddleware(history)

  middleware.push(router)

  middleware.push(ipc)

  enhancers.push(applyMiddleware(...middleware))
  const enhancer = compose(...enhancers)

  return createStore(rootReducer, initialState, enhancer)
}

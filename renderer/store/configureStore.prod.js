import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { createMemoryHistory } from 'history'
import { routerMiddleware } from 'connected-react-router'
import { createLogger } from 'redux-logger'
import createRootReducer from 'reducers'
import ipc from 'reducers/ipc'

export const history = createMemoryHistory({ basename: window.location.pathname })

export function configureStore(initialState) {
  const middleware = []
  const enhancers = []

  middleware.push(thunk)

  // Logging Middleware
  const logger = createLogger({
    level: 'info',
    collapsed: true,
  })
  middleware.push(logger)

  // Router Middleware
  const router = routerMiddleware(history)
  middleware.push(router)

  middleware.push(ipc)

  enhancers.push(applyMiddleware(...middleware))
  const enhancer = compose(...enhancers)

  return createStore(createRootReducer(history), initialState, enhancer)
}

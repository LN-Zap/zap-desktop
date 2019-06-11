import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { createMemoryHistory } from 'history'
import { createLogger } from 'redux-logger'
import rootReducer from 'reducers'
import ipc from 'reducers/ipc'
import debounceMiddleware from './middleware/debounceMiddleware'

export const history = createMemoryHistory({ basename: window.location.pathname })

export function configureStore(initialState) {
  const middleware = []
  const enhancers = []

  middleware.push(thunk)
  // Debounce Middleware
  middleware.push(debounceMiddleware)
  // Logging Middleware
  const logger = createLogger({
    level: 'info',
    collapsed: true,
  })

  middleware.push(logger)

  middleware.push(ipc)

  enhancers.push(applyMiddleware(...middleware))
  const enhancer = compose(...enhancers)

  return createStore(rootReducer, initialState, enhancer)
}

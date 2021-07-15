import { createMemoryHistory } from 'history'
import { createStore, applyMiddleware, compose } from 'redux'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'

import rootReducer from 'reducers'
import ipc from 'reducers/ipc'

import debounceMiddleware from './middleware/debounceMiddleware'

export const history = createMemoryHistory({
  basename: window.location.pathname,
})

const logger = createLogger({
  level: 'info',
  collapsed: true,
})

/**
 * configureStore - Configure redux store.
 *
 * @param {object} initialState Initial state
 * @returns {object} Configured store
 */
export const configureStore = initialState => {
  const enhancers = []

  // Apply Middleware.
  enhancers.push(applyMiddleware(thunk, debounceMiddleware, logger, ipc))

  // Apply Compose Enhancers.
  const enhancer = compose(...enhancers)

  // Create Store.
  return createStore(rootReducer, initialState, enhancer)
}

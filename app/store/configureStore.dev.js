import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { createMemoryHistory } from 'history'
import { routerActions, routerMiddleware } from 'connected-react-router'
import { createLogger } from 'redux-logger'
import createRootReducer from '../reducers'
import ipc from '../reducers/ipc'

export const history = createMemoryHistory()

export const configureStore = initialState => {
  // Redux Configuration
  const middleware = []
  const enhancers = []

  // Thunk Middleware
  middleware.push(thunk)

  // Logging Middleware
  const logger = createLogger({
    level: 'info',
    collapsed: true
  })
  middleware.push(logger)

  // Router Middleware
  const router = routerMiddleware(history)
  middleware.push(router)

  // Redux DevTools Configuration
  const actionCreators = {
    ...routerActions
  }
  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Options: http://zalmoxisus.github.io/redux-devtools-extension/API/Arguments.html
        actionCreators
      })
    : compose
  /* eslint-enable no-underscore-dangle */

  // Apply Middleware & Compose Enhancers
  enhancers.push(applyMiddleware(...middleware, ipc))
  const enhancer = composeEnhancers(...enhancers)

  // Create Store
  const store = createStore(createRootReducer(history), initialState, enhancer)

  if (module.hot) {
    // eslint-disable-next-line global-require
    module.hot.accept('../reducers', () => {
      store.replaceReducer(createRootReducer(history))
    })
  }

  return store
}

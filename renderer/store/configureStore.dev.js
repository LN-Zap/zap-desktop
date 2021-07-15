import { createMemoryHistory } from 'history'
import { createStore, applyMiddleware, compose } from 'redux'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'

import rootReducer from 'reducers'
import ipc from 'reducers/ipc'

import { debounceMiddleware, userTimingMiddleware } from './middleware'

export const history = createMemoryHistory()

const logger = createLogger({
  level: 'info',
  collapsed: true,
})

// Redux DevTools Configuration
// If Redux DevTools Extension is installed use it, otherwise use Redux compose
/* eslint-disable no-underscore-dangle */
const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        stateSanitizer: state => {
          const { invoice, locale, network } = state
          const MAX_NODES = 10

          return state.invoice
            ? {
                ...state,

                // Strip out long data from invoices to avoid bloat.
                invoice: {
                  ...invoice,
                  invoices: invoice.invoices.map(item => {
                    return {
                      ...item,
                      rHash: '<<R_HASH_BUFFER_DATA>>',
                      rPreimage: '<<R_PREIMAGE_BUFFER_DATA>>',
                    }
                  }),
                },

                // Slim down the nodes list.
                network: {
                  ...network,
                  nodes:
                    network.nodes.length > MAX_NODES
                      ? [
                          ...network.nodes.slice(0, MAX_NODES),
                          `<<${network.nodes.length - MAX_NODES}_MORE_NODES>>`,
                        ]
                      : network.nodes,
                },

                // Strip out translation strings.
                locale: Object.keys(locale).map(key => ({
                  [key]: `<<_LOCALE_DATA_FOR_${key}>>`,
                })),
              }
            : state
        },
      })
    : compose

/**
 * configureStore - Configure redux store.
 *
 * @param {object} initialState Initial state
 * @returns {object} Configured store
 */
export const configureStore = initialState => {
  const enhancers = []

  // Apply Middleware.
  enhancers.push(applyMiddleware(thunk, debounceMiddleware, logger, ipc, userTimingMiddleware))

  // Apply Compose Enhancers.
  const enhancer = composeEnhancers(...enhancers)

  // Create Store.
  const store = createStore(rootReducer, initialState, enhancer)

  // Enable hot reloading of reducers.
  if (module.hot) {
    module.hot.accept('reducers', () => {
      store.replaceReducer(rootReducer)
    })
  }

  return store
}

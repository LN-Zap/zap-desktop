import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { createMemoryHistory } from 'history'
import { routerActions, routerMiddleware } from 'connected-react-router'
import { createLogger } from 'redux-logger'
import createRootReducer from 'reducers'
import ipc from 'reducers/ipc'

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
    collapsed: true,
  })
  middleware.push(logger)

  // Router Middleware
  const router = routerMiddleware(history)
  middleware.push(router)

  // Redux DevTools Configuration
  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers =
    typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
          actionCreators: {
            ...routerActions,
          },
          stateSanitizer: state => {
            const { invoice, locale, network } = state
            const MAX_NODES = 10
            const MAX_EDGES = 10

            return state.invoice
              ? {
                  ...state,

                  // Strip out long data from invoices to avoid bloat.
                  invoice: {
                    ...invoice,
                    invoices: invoice.invoices.map(invoice => {
                      invoice.r_hash = '<<R_HASH_BUFFER_DATA>>'
                      invoice.r_preimage = '<<R_PREIMAGE_BUFFER_DATA>>'
                      return invoice
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
                    edges:
                      network.edges.length > MAX_EDGES
                        ? [
                            ...network.edges.slice(0, MAX_EDGES),
                            `<<${network.edges.length - MAX_EDGES}_MORE_NODES>>`,
                          ]
                        : network.edges,
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
  /* eslint-enable no-underscore-dangle */

  // Apply Middleware & Compose Enhancers
  enhancers.push(applyMiddleware(...middleware, ipc))
  const enhancer = composeEnhancers(...enhancers)

  // Create Store
  const store = createStore(createRootReducer(history), initialState, enhancer)

  if (module.hot) {
    module.hot.accept('reducers', () => {
      store.replaceReducer(createRootReducer(history))
    })
  }

  return store
}

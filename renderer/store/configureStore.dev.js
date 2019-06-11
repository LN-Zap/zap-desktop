import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { createMemoryHistory } from 'history'
import { createLogger } from 'redux-logger'
import rootReducer from 'reducers'
import ipc from 'reducers/ipc'
import debounceMiddleware from './middleware/debounceMiddleware'

export const history = createMemoryHistory()

export const configureStore = initialState => {
  // Redux Configuration
  const middleware = []
  const enhancers = []

  // Thunk Middleware
  middleware.push(thunk)
  // Debounce Middleware
  middleware.push(debounceMiddleware)
  // Logging Middleware
  const logger = createLogger({
    level: 'info',
    collapsed: true,
  })

  middleware.push(logger)

  // REDUX action profiling middle ware
  /* eslint-enable no-underscore-dangle */
  const userTiming = () => next => action => {
    // user timing API is not available
    if (!performance || !performance.mark) {
      return next(action)
    }

    // measure redux action
    performance.mark(`${action.type}_START`)
    const result = next(action)
    performance.mark(`${action.type}_END`)
    performance.measure(`${action.type}`, `${action.type}_START`, `${action.type}_END`)
    return result
  }

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

  // Apply Middleware & Compose Enhancers
  enhancers.push(applyMiddleware(...middleware, ipc, userTiming))
  const enhancer = composeEnhancers(...enhancers)

  // Create Store
  const store = createStore(rootReducer, initialState, enhancer)

  if (module.hot) {
    module.hot.accept('reducers', () => {
      store.replaceReducer(rootReducer)
    })
  }

  return store
}

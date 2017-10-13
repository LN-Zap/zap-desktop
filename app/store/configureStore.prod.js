import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { createBrowserHistory } from 'history'
import { routerMiddleware } from 'react-router-redux'
import rootReducer from '../reducers'
import ipc from '../reducers/ipc'

const middleware = []
const enhancers = []

middleware.push(thunk)

const history = createBrowserHistory()

const router = routerMiddleware(history)
middleware.push(router)

console.log('middleware: ', middleware)
enhancers.push(applyMiddleware(...middleware, ipc))
console.log('ENHANCERS: ', enhancers)
const enhancer = compose(...enhancers)
// const enhancer = applyMiddleware(thunk, router);

function configureStore(initialState) {
  return createStore(rootReducer, initialState, enhancer);
}

export default { configureStore, history };

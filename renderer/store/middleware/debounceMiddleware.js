import createDebouncedQueue from '@zap/utils/debouncedFuncQueue'

// contains queues for debounced actions
// <type, {promise, action}>
const queues = {}

/**
 * Creates a debounced queue for the specified action
 *
 * @param {Function} dispatch
 * @param {string} type
 * @param {number} wait The number of milliseconds to delay
 * @param {number} maxWait The maximum time `action` is allowed to be delayed before it's invoked
 * @returns {object} {promise, action} `promise` resolves when action is finally dispatched
 */
function createDebouncedAction({ dispatch, type, wait, maxWait }) {
  let action
  const promise = new Promise(resolve => {
    action = createDebouncedQueue(
      (...data) => {
        resolve(
          dispatch({
            type,
            data,
          })
        )
      },
      wait,
      maxWait
    )
  })

  return { promise, action }
}

/**
 * middleware - Redux middleware that debounce-batches action.
 *
 * If an action is set to be debounced the middleware accumulates action parameters and
 * dispatches it in a {type, data:[accumulated_params]} form
 * In order for an action to be compliant it needs to:
 * 1. Be plain (no thunks are currently supported)
 * 2. Use single `data` arg as action parameter
 * 3. Have {debounce:{wait, [maxWait]}} object in action params
 *
 * @example
 * {
 *   type: 'ACTION_TYPE',
 *   data: {field: Math.random()},
 *   debounce: {
 *    wait: 3000,
 *   }
 * }
 * @returns {Function}
 */
const middleware = () => dispatch => action => {
  const { debounce: { wait, maxWait } = {}, data, type } = action
  // check if this is a debounced action or a regular one
  if (wait) {
    // create new queue if it doesn't exit
    if (!queues[type]) {
      queues[type] = createDebouncedAction({ dispatch, type, wait, maxWait })
    }
    queues[type].action(data)
    const clear = () => (queues[type] = null)
    // new queue is created for the each batch
    return queues[type].promise.then(clear, clear)
  }

  return dispatch(action)
}

export default middleware

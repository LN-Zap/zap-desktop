import debounce from 'lodash/debounce'

/**
 * createDebouncedQueue - Creates a debounced function that delays invoking func until after wait milliseconds have
 * elapsed since the last time the debounced function was invoked
 * when function is finally invoked it's passed an array of accumulated  since the last call arguments
 *
 * @param {Function} func The function to debounce
 * @param {number} wait The number of milliseconds to delay
 * @param {number} maxWait The maximum time `func` is allowed to be delayed before it's invoked
 * @returns {Function} Returns the new debounced function
 */
const createDebouncedQueue = (func, wait, maxWait) => {
  // args accumulator
  const queue = []

  const debouncedFunc = debounce(
    () => {
      // flush queue
      func(...queue)
      queue.length = 0
    },
    wait,
    { maxWait }
  )

  return (...params) => {
    queue.push(...params)
    debouncedFunc()
  }
}

export default createDebouncedQueue

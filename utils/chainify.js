/**
 * chainifies promise-returning function that enqueues function
 * calls preventing concurrent calls
 *
 * @param {Function} fn function that returns a Promise
 * @returns {Function} function that returns a promise that resolves when original function
 * is called
 */
const chainify = fn => {
  let currentTask = Promise.resolve()
  return function(...args) {
    const cb = () => fn(...args)
    // eslint-disable-next-line promise/no-callback-in-promise
    currentTask = currentTask.then(cb, cb)
    return currentTask
  }
}

export default chainify

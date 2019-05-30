/**
 * chainifies promise-returning function that enqueues function
 * calls preventing concurrent calls
 *
 * @param {funciton} fn function that returns a Promise
 * @returns {Function} function that returns a promise that resolves when original function
 * is called
 */
export default function chainify(fn) {
  let currentTask = Promise.resolve()
  return function(...args) {
    const cb = () => fn(...args)
    // eslint-disable-next-line promise/no-callback-in-promise
    currentTask = currentTask.then(cb, cb)
    return currentTask
  }
}

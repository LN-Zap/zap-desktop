/**
 * promiseTimeout - Reject a promise if it doesn't resolve after a given timeout window.
 *
 * @param {number} ms Timeout (ms)
 * @param {Promise} promise Promise to timeout
 * @param {string} message messaged passed to the reject promise
 * @returns {Promise} Promise that rejects in <ms> milliseconds
 */
export default function(ms, promise, message = 'Timed out') {
  // Create a promise that rejects in <ms> milliseconds
  let timerId

  const timeout = new Promise((resolve, reject) => {
    timerId = setTimeout(() => reject(new Error(message)), ms)
  })
  const clearTimer = value => {
    timerId && clearTimeout(timerId)
    return value
  }
  // Returns a race between our timeout and the passed in promise
  return Promise.race([promise, timeout]).then(clearTimer, clearTimer)
}

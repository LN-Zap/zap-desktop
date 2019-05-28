/**
 * promiseTimeout - Reject a promise if it doesn't resolve after a given timeout window.
 *
 * @param {number} ms Timeout (ms)
 * @param {Promise} promise Promise to timeout
 * @returns {Promise} Promise that rejects in <ms> milliseconds
 */
const promiseTimeout = function(ms, promise) {
  // Create a promise that rejects in <ms> milliseconds
  let timeout = new Promise((resolve, reject) => {
    let id = setTimeout(() => {
      clearTimeout(id)
      reject(`Timed out.`)
    }, ms)
  })

  // Returns a race between our timeout and the passed in promise
  return Promise.race([promise, timeout])
}

export default promiseTimeout

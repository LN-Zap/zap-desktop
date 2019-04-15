/**
 * Helper function to return an absolute deadline given a relative timeout in seconds.
 * @param {number} timeoutSecs The number of seconds to wait before timing out
 * @return {Date} A date timeoutSecs in the future
 */
const getDeadline = timeoutSecs => {
  var deadline = new Date()
  deadline.setSeconds(deadline.getSeconds() + timeoutSecs)
  return deadline.getTime()
}

export default getDeadline

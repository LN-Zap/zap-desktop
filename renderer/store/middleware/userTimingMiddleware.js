/**
 * userTiming - Action profiling middleware.
 *
 * @returns {object} Modified action
 */
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

export default userTiming

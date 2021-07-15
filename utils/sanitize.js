import isObject from '@zap/utils/isObject'

import truncate from './truncate'

/**
 * sanitize - Sanitize specific object properties (by truncating them).
 *
 * NOTE: This method takes a rudimentary approach to modifying the object properties that could have unintended
 * side-effects, such as removing prototype data.
 *
 * @param {*} data sanitize (truncate) object properties
 * @param {Array} properties list of object properties to sanitize
 * @returns {*} cloned object with sanitized properties
 */
const sanitize = (data, properties = []) => {
  let sanitizedData
  if (isObject(data)) {
    sanitizedData = { ...data }
    properties.forEach(key => {
      if (data[key]) {
        sanitizedData[key] = truncate(data[key])
      }
    })
  }
  return sanitizedData || data
}

export default sanitize

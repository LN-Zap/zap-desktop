import isEqual from 'lodash/isEqual'
import transform from 'lodash/transform'

import isObject from '@zap/utils/isObject'

/**
 * Deep diff between two object, using lodash
 *
 * @param {object} object Object compared
 * @param {object} base   Object to compare with
 * @returns {object}        Return a new object who represent the diff
 */
const difference = (object, base) => {
  return transform(object, (result, value, key) => {
    if (!isEqual(value, base[key])) {
      result[key] = isObject(value) && isObject(base[key]) ? difference(value, base[key]) : value
    }
  })
}

export default difference

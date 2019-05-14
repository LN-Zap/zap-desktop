import transform from 'lodash.transform'
import isEqual from 'lodash.isequal'
import isObject from '@zap/utils/isObject'

/**
 * Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */
const difference = (object, base) => {
  return transform(object, (result, value, key) => {
    if (!isEqual(value, base[key])) {
      result[key] = isObject(value) && isObject(base[key]) ? difference(value, base[key]) : value
    }
  })
}

export default difference

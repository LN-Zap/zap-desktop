import { promisify } from 'util'

/**
 * promisifiedCall - Promisifies specified method and calls it with @thisArg as this and passes @args as an object.
 *
 * @param {*} thisArg This arg
 * @param {*} method Method to promisy
 * @param {*} args Arguments to pass call method with
 * @returns {Function} Promisified method
 */
export default function promisifiedCall(thisArg, method, args) {
  return promisify(method).call(thisArg, args)
}

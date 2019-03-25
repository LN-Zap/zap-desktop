import { promisify } from 'util'

/**
 * Promisifies specified method and calls it with @thisArg as this and passes @args as an object
 * @param {*} thisArg
 * @param {*} method
 * @param {*} args
 */
export default function promisifiedCall(thisArg, method, args) {
  return promisify(method).call(thisArg, args)
}

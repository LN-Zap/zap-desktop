import cloneDeep from 'lodash/cloneDeep'
import has from 'lodash/has'

/**
 * defineEvents - Creates an event definition for the specified event map.
 *
 * @param {object} events Plain js object. Terminal(leaf) properties of it must be strings
 * that represent the event names
 * @returns {object} Proxy object that converts leaf paths to stings e.g order.list.post will
 * yield 'order.list.post' string. Throws exceptions on non-existent paths and also attempts to
 * convert interim paths (e.g order.list) to string. If an interim path is needed
 * call getPath() explicitly.
 */
export default function defineEvents(events) {
  const path = []

  // Resets current path array and returned current path as a string.
  const flush = () => {
    const curPath = path.join('.')
    path.length = 0
    return curPath
  }

  const handler = {
    get(target, key) {
      // Allows to get intermediate paths
      if (key === 'getPath') {
        return () => flush()
      }

      // Check if it's proxy call and skip.
      if (key === 'isProxy') {
        return true
      }

      if (key === Symbol.toPrimitive && typeof target !== 'string') {
        throw new Error(`Attempt to evaluate event name not at a leaf point in ${flush()}`)
      }
      const { [key]: prop } = target
      // Throw exception if property not found.
      if (typeof prop === 'undefined') {
        throw new Error(`Prop ${key} is not defined in ${flush()}`)
      }

      // Convert interim objects to proxies.
      if (!prop.isProxy && typeof prop === 'object') {
        target[key] = new Proxy(prop, handler)
      }

      path.push(key)
      // We've reached the leaf
      const value = Reflect.get(target, key)
      if (typeof value === 'string') {
        const res = flush()

        if (value !== key) {
          throw new Error(`Leaf key and values must be equal. key: ${key}, value: ${value}`)
        }

        if (!has(events, res)) {
          throw new Error(
            `Event path ${res} doesn't exist. You've probably used assignment or
             other manipulations with event definition`
          )
        }
        return res
      }

      return target[key]
    },
    set() {
      throw new Error('Assignment not allowed')
    },
  }

  return new Proxy(cloneDeep(events), handler)
}

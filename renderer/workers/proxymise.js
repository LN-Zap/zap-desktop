/* eslint-disable no-underscore-dangle */
// adapted from https://github.com/kozhevnikov/proxymise
// comlink compatible version

const proxymise = target => {
  if (typeof target === 'object') {
    const proxy = () => target
    proxy.__proxy__ = true
    return new Proxy(proxy, handler)
  }
  return typeof target === 'function' ? new Proxy(target, handler) : target
}

const isComlinkFn = value => Reflect.has(value, '__isComlink__')

const getProp = (target, property, receiver) => {
  return typeof target === 'object' ? Reflect.get(target, property, receiver) : target[property]
}

const get = (target, property, receiver) => {
  const value = getProp(target, property, receiver)

  if (typeof value === 'function' && typeof value.bind === 'function') {
    return Object.assign(value.bind(target), value)
  }

  if (isComlinkFn(target)) {
    // wrap comlink functions to avoid cloning errors
    const result = () => target()[property]
    result.__isComlink__ = true
    return result
  }
  return value
}

const handler = {
  construct(target, argumentsList) {
    const targetObj = target.__proxy__ ? target() : target
    return proxymise(Reflect.construct(targetObj, argumentsList))
  },

  get(target, property, receiver) {
    const targetObj = target.__proxy__ ? target() : target
    if (property !== 'then' && property !== 'catch' && typeof targetObj.then === 'function') {
      return proxymise(
        targetObj.then(value => {
          const fn = getProp(value, property)
          // wrap comlink functions to avoid cloning errors
          if (typeof fn === 'function') {
            const result = () => fn
            result.__isComlink__ = true
            return result
          }
          return get(value, property, receiver)
        })
      )
    }
    return proxymise(get(targetObj, property, receiver))
  },

  apply(target, thisArg, argumentsList) {
    const targetObj = target.__proxy__ ? target() : target
    if (typeof targetObj.then === 'function') {
      return proxymise(
        targetObj.then(value => {
          return Reflect.apply(isComlinkFn(value) ? value() : value, thisArg, argumentsList)
        })
      )
    }
    return proxymise(Reflect.apply(targetObj, thisArg, argumentsList))
  },
}

export default proxymise

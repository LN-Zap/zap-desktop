/**
 * Creates a function that produces singleton instances based
 * on `instanceDefinition`
 *
 * @param {object} instanceDefinition  Instance definitions. Is used to instantiate
 * singleton classes. Has the following structure
 * {key: ConstructorFn} `key` is used to access singleton instances,
 * `ConstructorFn` is constructor function used to instantiate objects
 * @returns {Function} singleton factory method
 */
const createSingletonFactory = instanceDefinition => {
  const instanceMap = {}
  /**
   * Singleton factory
   *
   * @param {string} key one of keys used in  `instanceDefinition` as `key`
   * @returns {object|null} class instance
   */
  return key => {
    if (instanceMap[key]) {
      return instanceMap[key]
    }

    const ConstructorFn = instanceDefinition[key]
    if (ConstructorFn) {
      instanceMap[key] = new ConstructorFn()
      return instanceMap[key]
    }

    return null
  }
}

export default createSingletonFactory

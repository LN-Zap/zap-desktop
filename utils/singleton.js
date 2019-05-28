/**
 * Creates a function that produces singleton instances based
 * on `instanceDefinition`
 *
 * @export
 * @param {Object} instanceDefinition  Instance definitions. Is used to instantiate
 * singleton classes. Has the following structure
 * {key: constructorFn} `key` is used to access singleton instances,
 * `constructorFn` is constructor function used to instantiate objects
 * @returns {Function} singleton factory method
 */
export default function createSingletonFactory(instanceDefinition) {
  const instanceMap = {}
  /**
   * Singleton factory
   *
   * @param {string} key one of keys used in  `instanceDefinition` as `key`
   * @returns {Object|null} class instance
   */
  return key => {
    if (instanceMap[key]) {
      return instanceMap[key]
    }

    const constructorFn = instanceDefinition[key]
    if (constructorFn) {
      instanceMap[key] = new constructorFn()
      return instanceMap[key]
    }

    return null
  }
}

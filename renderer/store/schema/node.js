import Dexie from 'dexie'

/**
 * @class Node
 * Node helper class.
 */
export default class Node {
  static SCHEMA = {
    id: String,
    hasSynced: Boolean,
    addresses: Object,
  }

  /**
   * getCurrentAddress - Get current address of a given type.
   *
   * @param  {string} type type of address to fetch.
   * @returns {string} current address of requested type, if one exists.
   */
  getCurrentAddress(type) {
    return Dexie.getByKeyPath(this, `addresses.${type}`)
  }

  /**
   * setCurrentAddress - Set current address of a given type.
   *
   * @param  {string} type type of address to save.
   * @param  {string} address address to save.
   * @returns {Node} updated node instance.
   */
  setCurrentAddress(type, address) {
    Dexie.setByKeyPath(this, `addresses.${type}`, address)
    return this
  }
}

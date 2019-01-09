import Dexie from 'dexie'

// Suffex the database name with NODE_ENV so that wer can have per-env databases.
export const getDbName = () => {
  const env = process.env.NODE_ENV || 'development'
  return `ZapDesktop.${env}`
}

// Define the database.
const db = new Dexie(getDbName())

db.version(1).stores({
  settings: 'key',
  wallets: '++id, type, chain, network',
  nodes: 'id'
})

/**
 * @class Wallet
 * Wallet helper class.
 */
export const Wallet = db.wallets.defineClass({
  id: Number,
  type: String,
  network: String,
  chain: String,
  alias: String,
  name: String,
  autopilot: Boolean,
  cert: String,
  host: String,
  macaroon: String
})

Object.defineProperty(Wallet.prototype, 'wallet', {
  get: function wallet() {
    return `wallet-${this.id}`
  }
})

/**
 * @class Node
 * Node helper class.
 */
export const Node = db.nodes.defineClass({
  id: String,
  hasSynced: Boolean,
  addresses: Object
})

/**
 * Get current address of a given type.
 * @param  {String} type type of address to fetch.
 * @return {String} current address of requested type, if one exists.
 */
Node.prototype.getCurrentAddress = function(type) {
  return Dexie.getByKeyPath(this, `addresses.${type}`)
}

/**
 * Set current address of a given type.
 * @param  {String} type type of address to save.
 * @param  {String} address address to save.
 * @return {Node} updated node instance.
 */
Node.prototype.setCurrentAddress = function(type, address) {
  Dexie.setByKeyPath(this, `addresses.${type}`, address)
  return db.nodes.put(this)
}

export default db

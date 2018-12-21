import Dexie from 'dexie'

// Suffex the database name with NODE_ENV so that wer can have per-env databases.
export const getDbName = () => {
  let name = `ZapDesktop`
  if (process.env.NODE_ENV) {
    name += `.${process.env.NODE_ENV}`
  }
  return name
}

// Define the database.
const db = new Dexie(getDbName())
db.version(1).stores({
  settings: 'key',
  wallets: '++id, type, chain, network',
  nodes: 'id'
})

// Set initial active wallet.
db.on('populate', async function() {
  // If there are already some bitcoin testnet wallet before the database has been created, import them into the
  // database and set the active wallet as wallet 1. This is for users upgrading from versions prior to 0.3.0.
  const fsWallets = await window.Zap.getLocalWallets('bitcoin', 'testnet')
  if (fsWallets.length > 0) {
    await fsWallets.filter(wallet => wallet !== 'wallet-tmp').forEach(async wallet => {
      await db.wallets.add({
        type: 'local',
        chain: 'bitcoin',
        network: 'testnet',
        wallet
      })
    })
    await db.settings.add({ key: 'activeWallet', value: 1 })
  }
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

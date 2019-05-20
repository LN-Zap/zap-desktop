import Dexie from 'dexie'
import decode from 'lndconnect/decode'
import encode from 'lndconnect/encode'

export const getDb = name => {
  // Define the database.
  const db = new Dexie(name)

  db.version(1).stores({
    settings: 'key',
    wallets: '++id, type, chain, network',
    nodes: 'id',
  })

  // Migrate custom wallets to lndconnect.
  db.version(2).upgrade(tx =>
    tx.wallets.toCollection().modify((wallet, ref) => {
      // All configs are now stored as an lndconnect uri.
      wallet.decoder = 'lnd.lndconnect.v1'

      // Convert old connection props to lndconnect uri.
      if (['custom', 'btcpayserver'].includes(wallet.type)) {
        try {
          const { host, cert, macaroon } = wallet
          const lndconnectUri = encode({ host, cert, macaroon })
          wallet.type = 'custom'
          wallet.lndconnectUri = lndconnectUri
        } catch (e) {
          // There was a problem migrating this wallet config.
          // There isn't a way for us to recover from this, so delete the wallet config to ensure that we don't end up
          // with invalid configs in the database.
          //
          // See https://dexie.org/docs/Collection/Collection.modify()#sample-deleting-object
          delete ref.value
        }
      }

      // Remove old props.
      delete wallet.host
      delete wallet.cert
      delete wallet.macaroon
      delete wallet.string
    })
  )
  db.version(3).stores({
    autopay: 'id',
  })

  /**
   * @class Wallet
   * Wallet helper class.
   */
  const Wallet = db.wallets.defineClass({
    id: Number,
    type: String,
    network: String,
    chain: String,
    decoder: String,
    lndconnectUri: String,
    name: String,
    alias: String,
    autopilot: Boolean,
    autopilotMaxchannels: Number,
    autopilotAllocation: Number,
    autopilotMinchansize: Number,
    autopilotMaxchansize: Number,
    autopilotPrivate: Boolean,
    autopilotMinconfs: Number,
    backup: Object,
  })

  // Strip out all unknown properties on create.
  db.wallets.hook('creating', function(primKey, obj) {
    Object.keys(obj).forEach(key => {
      if (!Object.keys(db.wallets.schema.instanceTemplate).includes(key)) {
        delete obj[key]
      }
    })
  })

  // Strip out all unknown properties on update.
  db.wallets.hook('updating', function(modifications, primKey, obj) {
    return Object.keys({ ...obj, ...modifications }).reduce((acc, cur) => {
      const isValidKey = Object.keys(db.wallets.schema.instanceTemplate).includes(cur)
      const isInMods = Object.keys(modifications).includes(cur)
      let newVal = isInMods ? modifications[cur] : obj[cur]
      return {
        ...acc,
        [cur]: isValidKey ? newVal : undefined,
      }
    }, {})
  })

  // Inject `wallet` property.
  db.wallets.hook('reading', function(obj) {
    obj.wallet = `wallet-${obj.id}`
    return obj
  })

  // Set up getters for host, cert, and macaroon.
  const props = ['host', 'cert', 'macaroon']
  props.forEach(prop => {
    Object.defineProperty(Wallet.prototype, prop, {
      enumerable: true,
      get: function() {
        if (this.decoder === 'lnd.lndconnect.v1' && this.lndconnectUri) {
          const data = decode(this.lndconnectUri)
          return data[prop]
        }
        return
      },
    })
  })

  /**
   * @class Node
   * Node helper class.
   */
  const Node = db.nodes.defineClass({
    id: String,
    hasSynced: Boolean,
    addresses: Object,
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

  return db
}

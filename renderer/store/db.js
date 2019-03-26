import Dexie from 'dexie'
import decode from 'lndconnect/decode'
import encode from 'lndconnect/encode'
import parseConnectionString from '@zap/utils/btcpayserver'

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
    tx.wallets.toCollection().modify(wallet => {
      if (wallet.type === 'local') {
        wallet.decoder = 'lnd.lndconnect.v1'
      }

      // Convert old connection props to lndconnect uri.
      else if (wallet.type === 'custom') {
        const { host, cert, macaroon } = wallet
        const lndconnectUri = encode({ host, cert, macaroon })
        wallet.type = 'custom'
        wallet.decoder = 'lnd.lndconnect.v1'
        wallet.lndconnectUri = lndconnectUri
      }

      // Convert btcpayserver configs to lndconnect uri.
      else if (wallet.type === 'btcpayserver') {
        try {
          const { host, port, macaroon } = parseConnectionString(wallet.string)
          const lndconnectUri = encode({ host: `${host}:${port}`, macaroon })
          wallet.type = 'custom'
          wallet.decoder = 'lnd.lndconnect.v1'
          wallet.lndconnectUri = lndconnectUri
        } catch (e) {
          // There was a problem migrating this wallet config.
          // There isn't a way for us to recover from this so we do nothing and move on.
        }
      }

      // Remove old props.
      delete wallet.host
      delete wallet.cert
      delete wallet.macaroon
      delete wallet.string
    })
  )

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
  })

  Object.defineProperty(Wallet.prototype, 'wallet', {
    get: function() {
      return `wallet-${this.id}`
    },
  })

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

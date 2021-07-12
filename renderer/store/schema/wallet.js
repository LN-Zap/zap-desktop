import decode from 'lndconnect/decode'
import get from 'lodash/get'
import set from 'lodash/set'

const getlndConnectProp = (lndconnectUri, prop) => {
  const data = decode(lndconnectUri)
  return data[prop]
}

/**
 * @class Wallet
 * Wallet helper class.
 */
export default class Wallet {
  /**
   * Define the model schema.
   */
  static SCHEMA = {
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
    neutrinoNodes: Array,
    whitelistPeers: Boolean,
  }

  /**
   * host - Get host using specified decoder.
   *
   * @returns {string|null} Host
   */
  get host() {
    if (this.decoder === 'lnd.lndconnect.v1' && this.lndconnectUri) {
      return getlndConnectProp(this.lndconnectUri, 'host')
    }
    return null
  }

  /**
   * cert - Get cert using specified decoder.
   *
   * @returns {string|null} Cert
   */
  get cert() {
    if (this.decoder === 'lnd.lndconnect.v1' && this.lndconnectUri) {
      return getlndConnectProp(this.lndconnectUri, 'cert')
    }
    return null
  }

  /**
   * macaroon - Get macaroon using specified decoder.
   *
   * @returns {string|null} Macaroon
   */
  get macaroon() {
    if (this.decoder === 'lnd.lndconnect.v1' && this.lndconnectUri) {
      return getlndConnectProp(this.lndconnectUri, 'macaroon')
    }
    return null
  }
}

export const hooks = {
  /**
   * reading - Inject `wallet` property.
   *
   * @param {object} obj [description]
   * @returns {object}     [description]
   */
  reading(obj) {
    obj.wallet = `wallet-${obj.id}`
    return obj
  },

  /**
   * updating - Strip out all unknown properties on update.
   *
   * @param {object} modifications Modifications to apply
   * @param {string} primKey The primary key of the object being updated
   * @param {object} obj Object that is about to be updated
   * @returns {object} Updates to apply
   */
  updating(modifications, primKey, obj) {
    return Object.keys({ ...obj, ...modifications }).reduce((acc, cur) => {
      const [rootKey] = cur.split('.')
      const isValidKey = Object.keys(Wallet.SCHEMA).includes(rootKey)
      if (isValidKey) {
        const isInMods = Object.keys(modifications).includes(cur)
        const newVal = isInMods ? modifications[cur] : get(obj, cur)
        set(acc, cur, newVal)
      } else {
        // if key is not in the whitelist set it to undefined
        // so it's later merged with the db object
        set(acc, cur, undefined)
      }
      return acc
    }, {})
  },

  /**
   * creating - Strip out all unknown properties on create.
   *
   * @param {string} primKey [description]
   * @param {object} obj     [description]
   */
  creating(primKey, obj) {
    Object.keys(obj).forEach(key => {
      if (!Object.keys(Wallet.SCHEMA).includes(key)) {
        delete obj[key]
      }
    })
  },
}

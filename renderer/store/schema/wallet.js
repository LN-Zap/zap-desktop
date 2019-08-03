import decode from 'lndconnect/decode'

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
   * @param  {object} obj [description]
   * @returns {object}     [description]
   */
  reading: function(obj) {
    obj.wallet = `wallet-${obj.id}`
    return obj
  },

  /**
   * updating - Strip out all unknown properties on update.
   *
   * @param  {object} modifications [description]
   * @param  {string} primKey       [description]
   * @param  {object} obj           [description]
   */
  updating: function(modifications, primKey, obj) {
    Object.keys({ ...obj, ...modifications }).reduce((acc, cur) => {
      const isValidKey = Object.keys(Wallet.SCHEMA).includes(cur)
      const isInMods = Object.keys(modifications).includes(cur)
      let newVal = isInMods ? modifications[cur] : obj[cur]
      return {
        ...acc,
        [cur]: isValidKey ? newVal : undefined,
      }
    }, {})
  },

  /**
   * creating - Strip out all unknown properties on create.
   *
   * @param  {string} primKey [description]
   * @param  {object} obj     [description]
   */
  creating: function(primKey, obj) {
    Object.keys(obj).forEach(key => {
      if (!Object.keys(Wallet.SCHEMA).includes(key)) {
        delete obj[key]
      }
    })
  },
}

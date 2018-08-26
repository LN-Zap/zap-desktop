// @flow

import { join } from 'path'
import { app } from 'electron'
import Store from 'electron-store'
import pick from 'lodash.pick'
import createDebug from 'debug'
import untildify from 'untildify'
import tildify from 'tildify'
import { appRootPath, binaryPath } from './util'

const debug = createDebug('zap:lnd-config')

// Supported connection types.
const types = {
  local: 'Local',
  custom: 'Custom',
  btcpayserver: 'BTCPay Server'
}

// Supported currencies.
const currencties = {
  bitcoin: 'Bitcoin',
  litecoin: 'Litecoin'
}

// Supported networks.
const networks = {
  mainnet: 'Mainnet',
  testnet: 'Testnet'
}

// Type definition for for local connection settings.
type LndConfigSettingsLocalType = {|
  alias?: string,
  autopilot?: boolean
|}

// Type definition for for custom connection settings.
type LndConfigSettingsCustomType = {|
  host: string,
  cert: string,
  macaroon: string
|}

// Type definition for for BTCPay Server connection settings.
type LndConfigSettingsBtcPayServerType = {|
  string: string,
  host: string,
  macaroon: string
|}

// Type definition for for BTCPay Server connection settings.
type LndConfigSettingsType = {|
  type: $Keys<typeof types>,
  currency: $Keys<typeof currencties>,
  network: $Keys<typeof networks>,
  wallet: string
|}

// Type definition for LndConfig constructor options.
type LndConfigOptions = {|
  ...LndConfigSettingsType,
  settings?:
    | LndConfigSettingsLocalType
    | LndConfigSettingsCustomType
    | LndConfigSettingsBtcPayServerType
|}

const _host = new WeakMap()
const _cert = new WeakMap()
const _macaroon = new WeakMap()
const _string = new WeakMap()

/**
 * Utility methods to clean and prepare data.
 */
const safeTrim = <T>(val: ?T): ?T => (typeof val === 'string' ? val.trim() : val)
const safeTildify = <T>(val: ?T): ?T => (typeof val === 'string' ? tildify(val) : val)
const safeUntildify = <T>(val: ?T): ?T => (typeof val === 'string' ? untildify(val) : val)

/**
 * LndConfig class
 */
class LndConfig {
  static DEFAULT_CONFIG = {
    type: 'local',
    currency: 'bitcoin',
    network: 'testnet',
    wallet: 'wallet-1'
  }
  static SETTINGS_PROPS = {
    local: ['alias', 'autopilot'],
    custom: ['host', 'cert', 'macaroon'],
    btcpayserver: ['host', 'macaroon', 'string']
  }
  static store = new Store({ name: 'connection' })

  // Type descriptor properties.
  type: string
  currency: string
  network: string
  wallet: string

  // User configurable settings.
  host: ?string
  cert: ?string
  macaroon: ?string
  string: ?string
  alias: ?string
  autopilot: ?boolean

  // Read only data properties.
  +key: string
  +binaryPath: string
  +lndDir: string
  +configPath: string
  +rpcProtoPath: string

  /**
   * Lnd configuration class.
   *
   * @param {LndConfigOptions} [options] Lnd config options.
   * @param {string} options.type config type (Local|custom|btcpayserver)
   * @param {string} options.currency config currency (bitcoin|litecoin)
   * @param {string} options.network config network (mainnet|testnet)
   * @param {string} options.wallet config wallet name (eg wallet-1)
   * @param {Object} [options.settings] config settings used to initialise the config with.
   */
  constructor(options?: LndConfigOptions) {
    debug('Constructor called with options: %o', options)

    // Define properties that we support with custom getters and setters as needed.
    // flow currently doesn't support defineProperties properly (https://github.com/facebook/flow/issues/285)
    const { defineProperties } = Object
    defineProperties(this, {
      key: {
        get() {
          return `${this.type}.${this.currency}.${this.network}.${this.wallet}`
        }
      },
      binaryPath: {
        enumerable: true,
        get() {
          return binaryPath()
        }
      },
      lndDir: {
        enumerable: true,
        get() {
          return join(app.getPath('userData'), 'lnd', this.currency, this.network, this.wallet)
        }
      },
      configPath: {
        enumerable: true,
        get() {
          return join(appRootPath(), 'resources', 'lnd.conf')
        }
      },
      rpcProtoPath: {
        enumerable: true,
        get() {
          return join(appRootPath(), 'resources', 'rpc.proto')
        }
      },

      // Getters / Setters for host property.
      //  - Trim value before saving.
      host: {
        enumerable: true,
        get() {
          return _host.get(this)
        },
        set(value: string) {
          _host.set(this, safeTrim(value))
        }
      },

      // Getters / Setters for cert property.
      //  - Untildify value on retrieval.
      //  - Trim value before saving.
      cert: {
        enumerable: true,
        get() {
          return safeUntildify(_cert.get(this))
        },
        set(value: string) {
          _cert.set(this, safeTrim(value))
        }
      },

      // Getters / Setters for macaroon property.
      //  - Untildify value on retrieval.
      //  - Trim value before saving.
      macaroon: {
        enumerable: true,
        get() {
          return safeUntildify(_macaroon.get(this))
        },
        set(value: string) {
          _macaroon.set(this, safeTrim(value))
        }
      },

      // Getters / Setters for string property.
      //  - Trim value before saving.
      string: {
        enumerable: true,
        get() {
          return _string.get(this)
        },
        set(value: string) {
          _string.set(this, safeTrim(value))
        }
      }
    })

    // If options were provided, use them to initialise the instance.
    if (options) {
      this.type = options.type
      this.currency = options.currency
      this.network = options.network
      this.wallet = options.wallet

      // If settings were provided then clean them up and assign them to the instance for easy access.
      if (options.settings) {
        debug('Setting settings as: %o', options.settings)
        Object.assign(this, options.settings)
      }
    }

    // If no options were provided load the details of the current active or default wallet.
    else {
      const settings = new Store({ name: 'settings' })
      const activeConnection: ?LndConfigSettingsType = settings.get('activeConnection')
      debug('Determined active connection as: %o', activeConnection)

      if (activeConnection && Object.keys(activeConnection).length > 0) {
        debug('Assigning connection details from activeConnection as: %o', activeConnection)
        Object.assign(this, activeConnection)
      }

      // If the connection settings were not found for the configured active connection, load the default values.
      debug('Fetching connection config for %s', this.key)
      if (!this.key || (this.key && !LndConfig.store.has(this.key))) {
        debug('Active connection config not found. Setting config as: %o', LndConfig.DEFAULT_CONFIG)
        Object.assign(this, LndConfig.DEFAULT_CONFIG)
      }
    }

    // For local configs host/cert/macaroon are auto-generated.
    if (this.type === 'local') {
      const defaultLocalOptions = {
        host: 'localhost:10009',
        cert: join(this.lndDir, 'tls.cert'),
        macaroon: join(this.lndDir, 'data', 'chain', this.currency, this.network, 'admin.macaroon')
      }
      debug('Connection type is local. Assigning settings as: %o', defaultLocalOptions)
      Object.assign(this, defaultLocalOptions)
    }
  }

  /**
   * Load settings for this configuration from the store.
   * @return {LndConfig} Updated LndConfig object.
   */
  load() {
    const settings = pick(LndConfig.store.get(this.key, {}), LndConfig.SETTINGS_PROPS[this.type])
    debug('Loaded settings for %s config as: %o', this.key, settings)
    return Object.assign(this, settings)
  }

  /**
   * Save settings for this configuration to the store.
   * @return {LndConfig} Updated LndConfig object.
   */
  save() {
    const settings = pick(this, LndConfig.SETTINGS_PROPS[this.type])

    // Tildify cert and macaroon values before storing for better portability.
    if (settings.cert) {
      settings.cert = safeTildify(settings.cert)
    }
    if (settings.macaroon) {
      settings.macaroon = safeTildify(settings.macaroon)
    }

    debug('Saving settings for %s config as: %o', this.key, settings)
    LndConfig.store.set(this.key, settings)
    return this
  }
}

export default LndConfig

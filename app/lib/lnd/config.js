// @flow

import { join } from 'path'
import { app } from 'electron'
import createDebug from 'debug'
import untildify from 'untildify'
import tildify from 'tildify'
import { appRootPath, binaryPath } from './util'

const debug = createDebug('zap:lnd-config')

// Supported connection types.
export const types = {
  local: 'Local',
  custom: 'Custom',
  btcpayserver: 'BTCPay Server'
}

// Supported chains.
export const chains = {
  bitcoin: 'Bitcoin',
  litecoin: 'Litecoin'
}

// Supported networks.
export const networks = {
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
  id?: number,
  wallet?: string,
  type: $Keys<typeof types>,
  chain: $Keys<typeof chains>,
  network: $Keys<typeof networks>
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
  static SETTINGS_PROPS = {
    local: ['alias', 'autopilot'],
    custom: ['host', 'cert', 'macaroon'],
    btcpayserver: ['host', 'macaroon', 'string']
  }

  // Type descriptor properties.
  id: number
  type: string
  chain: string
  network: string

  // User configurable settings.
  host: ?string
  cert: ?string
  macaroon: ?string
  string: ?string
  alias: ?string
  autopilot: ?boolean

  // Read only data properties.
  +wallet: string
  +binaryPath: string
  +lndDir: string
  +configPath: string
  +rpcProtoPath: string

  /**
   * Lnd configuration class.
   *
   * @param {LndConfigOptions} [options] Lnd config options.
   * @param {string} options.type config type (Local|custom|btcpayserver)
   * @param {string} options.chain config chain (bitcoin|litecoin)
   * @param {string} options.network config network (mainnet|testnet)
   * @param {Object} [options.settings] config settings used to initialise the config with.
   */
  constructor(options?: LndConfigOptions) {
    debug('Constructor called with options: %o', options)

    // Define properties that we support with custom getters and setters as needed.
    // flow currently doesn't support defineProperties properly (https://github.com/facebook/flow/issues/285)
    const { defineProperties } = Object
    defineProperties(this, {
      wallet: {
        enumerable: true,
        get() {
          if (this.type === 'local') {
            return `wallet-${this.id}`
          }
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
          if (this.type === 'local') {
            return join(app.getPath('userData'), 'lnd', this.chain, this.network, this.wallet)
          }
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
          _cert.set(this, safeTildify(safeTrim(value)))
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
          _macaroon.set(this, safeTildify(safeTrim(value)))
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
      if (options.id) {
        this.id = options.id
      }
      this.type = options.type
      this.chain = options.chain
      this.network = options.network

      // If settings were provided then clean them up and assign them to the instance for easy access.
      if (options.settings) {
        debug('Setting settings as: %o', options.settings)
        Object.assign(this, options.settings)
      }
    }

    // For local configs host/cert/macaroon are auto-generated.
    if (this.type === 'local') {
      const defaultLocalOptions = {
        host: 'localhost:10009',
        cert: join(this.lndDir, 'tls.cert'),
        macaroon: join(this.lndDir, 'data', 'chain', this.chain, this.network, 'admin.macaroon')
      }
      debug('Connection type is local. Assigning settings as: %o', defaultLocalOptions)
      Object.assign(this, defaultLocalOptions)
    }
  }
}

export default LndConfig

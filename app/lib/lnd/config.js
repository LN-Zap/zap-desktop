// @flow

import { join, isAbsolute } from 'path'
import { app } from 'electron'
import createDebug from 'debug'
import untildify from 'untildify'
import tildify from 'tildify'
import lndconnect from 'lndconnect'
import fs from 'fs'
import util from 'util'
import pick from 'lodash.pick'
import { mainLog } from '../utils/log'
import { appRootPath, binaryPath } from './util'

const readFile = util.promisify(fs.readFile)

const debug = createDebug('zap:lnd-config')

const LNDCONFIG_TYPE_LOCAL = 'local'
const LNDCONFIG_TYPE_CUSTOM = 'custom'

// Supported connection types.
export const types = {
  [LNDCONFIG_TYPE_LOCAL]: 'Local',
  [LNDCONFIG_TYPE_CUSTOM]: 'Custom'
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

// Type definition for LndConfig constructor options.
export type LndConfigOptions = {
  id?: number,
  type: $Keys<typeof types>,
  chain: $Keys<typeof chains>,
  network: $Keys<typeof networks>,

  decoder: string,
  lndconnectUri?: string,
  host?: string,
  cert?: string,
  macaroon?: string,

  name?: string,
  alias?: string,
  autopilot?: boolean,
  autopilotMaxchannels?: number,
  autopilotAllocation?: number,
  autopilotMinchansize?: number,
  autopilotMaxchansize?: number,
  autopilotPrivate?: boolean,
  autopilotMinconfs?: number
}

const _isReady = new WeakMap()
const _lndconnectQRCode = new WeakMap()

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
    name: null,
    alias: null,
    autopilot: true,
    autopilotMaxchannels: 5,
    autopilotMinchansize: 20000,
    autopilotMaxchansize: 16777215,
    autopilotAllocation: 0.6,
    autopilotPrivate: true,
    autopilotMinconfs: 0
  }

  // Type descriptor properties.
  id: number
  type: string
  chain: string
  network: string

  // connection properties
  decoder: string
  lndconnectUri: ?string
  host: ?string
  cert: ?string
  macaroon: ?string

  // Settings properties
  name: ?string
  alias: ?string
  autopilot: ?boolean
  autopilotMaxchannels: ?number
  autopilotMinchansize: ?number
  autopilotMaxchansize: ?number
  autopilotAllocation: ?number
  autopilotPrivate: ?boolean
  autopilotMinconfs: ?number

  // Read only data properties.
  +wallet: string
  +binaryPath: string
  +lndDir: string
  +configPath: string
  +isReady: Promise<boolean>

  /**
   * Lnd configuration class.
   *
   * @param {LndConfigOptions} [options] Lnd config options.
   */
  constructor(options?: LndConfigOptions) {
    debug('LndConfig constructor called with options: %o', options)

    // Define properties that we support with custom getters and setters as needed.
    // flow currently doesn't support defineProperties properly (https://github.com/facebook/flow/issues/285)
    const { defineProperties } = Object
    defineProperties(this, {
      wallet: {
        enumerable: true,
        get() {
          return `wallet-${this.id}`
        }
      },
      lndconnectQRCode: {
        enumerable: true,
        get() {
          return _lndconnectQRCode.get(this)
        }
      },

      isReady: {
        enumerable: false,
        get() {
          return _isReady.get(this)
        }
      },
      binaryPath: {
        enumerable: false,
        get() {
          return binaryPath()
        }
      },
      lndDir: {
        enumerable: false,
        get() {
          if (this.type === LNDCONFIG_TYPE_LOCAL) {
            return join(app.getPath('userData'), 'lnd', this.chain, this.network, this.wallet)
          }
        }
      },
      configPath: {
        enumerable: false,
        get() {
          return join(appRootPath(), 'resources', 'lnd.conf')
        }
      },

      host: {
        enumerable: false,
        set(host) {
          return this.setConnectionProp('host', host)
        },
        get() {
          return this.getConnectionProp('host')
        }
      },
      cert: {
        enumerable: false,
        set(cert) {
          return this.setConnectionProp('cert', cert)
        },
        get() {
          return this.getConnectionProp('cert')
        }
      },
      macaroon: {
        enumerable: false,
        set(macaroon) {
          return this.setConnectionProp('macaroon', macaroon)
        },
        get() {
          return this.getConnectionProp('macaroon')
        }
      }
    })

    // Assign default options.
    this.type = 'local'
    this.chain = global.CONFIG.neutrino.chain
    this.network = global.CONFIG.neutrino.network

    // If options were provided, use them to initialise the instance.
    if (options) {
      // Set base config.
      const baseConfig = pick(options, ['id', 'type', 'chain', 'network', 'decoder'])
      Object.assign(this, baseConfig)

      // Merge in whitelisted settings.
      const userSettings = pick(options, Object.keys(LndConfig.SETTINGS_PROPS))
      const settings = { ...LndConfig.SETTINGS_PROPS, ...userSettings }
      debug('Applying settings as: %o', settings)
      Object.assign(this, settings)

      // Generate lndConenct uri.
      const lndconnectUri = this.generateLndconnectUri(options)
      if (lndconnectUri) {
        debug('Generated lndconnectUri: %s', lndconnectUri)
        this.lndconnectUri = lndconnectUri
      }
    }

    // In order to calculate the `lndconnect` property value we must perform some async operations. This prevents us
    // from being able to set the value directly in the constructor as we do for all the other properties. So, we define
    // a `ready` property that resolves once we have calculated this value so that users of this class to wait until the
    // `ready` property has been resolved before using the class instance in order to ensure that the instance has been
    // fully instantiated.
    const isReady = async () => {
      try {
        if (this.lndconnectUri) {
          const lndconnectQRCode = await this.generateLndconnectQRCode()
          _lndconnectQRCode.set(this, lndconnectQRCode)
        }
        return true
      } catch (e) {
        mainLog.error('Unable to generate lndconnect uri: %s', e)
        return true
      }
    }
    _isReady.set(this, isReady())
  }

  /**
   * Generate an lndconnect uri based on the config options.
   */
  generateLndconnectUri(options: LndConfigOptions) {
    let { lndconnectUri, host, cert, macaroon } = options

    // If lndconnectUri is provided, use it as is.
    if (lndconnectUri) {
      return lndconnectUri
    }

    // If this is a custom type, assign the host, cert, and macaroon. This will generate the lndconnectUri.
    else if (this.type === LNDCONFIG_TYPE_CUSTOM) {
      return lndconnect.encode({ host, cert, macaroon })
    }

    // Otherwise if this is a local wallet, set the lnd connection details based on wallet config.
    else if (this.type === LNDCONFIG_TYPE_LOCAL) {
      host = 'localhost:10009'
      cert = join(this.lndDir, 'tls.cert')
      macaroon = join(this.lndDir, 'data', 'chain', this.chain, this.network, 'admin.macaroon')
      return lndconnect.encode({ host, cert, macaroon })
    }
  }

  /**
   * Generate a flattened lnd connect uri. This will follow any filepaths, read the files and add the decoded content.
   */
  async generateLndconnectQRCode() {
    const { decoder, lndconnectUri } = this
    switch (decoder) {
      case 'lnd.lndconnect.v1':
        if (lndconnectUri) {
          return LndConfig.qrcodeFromLndconnectUri(lndconnectUri)
        }
        break
    }
  }

  /**
   * Setter helper for connection properties.
   */
  setConnectionProp(key: string, value: ?string) {
    if (this.decoder === 'lnd.lndconnect.v1') {
      const decoded = lndconnect.decode(this.lndconnectUri)
      this.lndconnectUri = lndconnect.encode({ ...decoded, [key]: safeTildify(safeTrim(value)) })
    }
  }

  /**
   * Getter helper for connection keyerties.
   */
  getConnectionProp(key: string) {
    if (this.decoder === 'lnd.lndconnect.v1') {
      const decoded = lndconnect.decode(this.lndconnectUri)
      return safeUntildify(decoded[key])
    }
  }

  /**
   * Generate an lndconnect QR code from an lndconenctUri.
   */
  static async qrcodeFromLndconnectUri(lndconnectUri: string) {
    const { host, cert, macaroon } = lndconnect.decode(lndconnectUri)
    const [certData, macaroonData] = await Promise.all([
      isAbsolute(cert) ? readFile(cert) : cert,
      isAbsolute(macaroon) ? readFile(macaroon) : macaroon
    ])
    return lndconnect.encode({ host, cert: certData, macaroon: macaroonData })
  }
}

export default LndConfig

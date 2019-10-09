import { join, isAbsolute } from 'path'
import createDebug from 'debug'
import untildify from 'untildify'
import tildify from 'tildify'
import lndconnect from 'lndconnect'
import fs from 'fs'
import util from 'util'
import pick from 'lodash/pick'
import get from 'lodash/get'
import config from 'config'
import { mainLog } from '@zap/utils/log'
import getLndListen from '@zap/utils/getLndListen'

const readFile = util.promisify(fs.readFile)

const debug = createDebug('zap:lnd-config')

const LNDCONFIG_TYPE_LOCAL = 'local'
const LNDCONFIG_TYPE_CUSTOM = 'custom'

// Supported connection types.
export const types = {
  [LNDCONFIG_TYPE_LOCAL]: 'Local',
  [LNDCONFIG_TYPE_CUSTOM]: 'Custom',
}

// Supported chains.
export const chains = {
  bitcoin: 'Bitcoin',
  litecoin: 'Litecoin',
}

// Supported networks.
export const networks = {
  mainnet: 'Mainnet',
  testnet: 'Testnet',
}

const _isReady = new WeakMap()
const _lndconnectQRCode = new WeakMap()

// Utility methods to clean and prepare data.
const safeTrim = val => (typeof val === 'string' ? val.trim() : val)
const safeTildify = val => (typeof val === 'string' ? tildify(val) : val)
const safeUntildify = val => (typeof val === 'string' ? untildify(val) : val)

/**
 * @class LndConfig
 * @param {*} options Lnd config options.
 */
class LndConfig {
  constructor(options) {
    debug('LndConfig constructor called with options: %o', options)

    Object.defineProperties(this, {
      wallet: {
        enumerable: true,
        get() {
          return `wallet-${this.id}`
        },
      },
      neutrinoNodes: {
        enumerable: true,
        get() {
          const { chain, network } = options
          return options.neutrinoNodes || get(config.lnd.neutrino, [chain, network], undefined)
        },
      },
      lndconnectQRCode: {
        enumerable: true,
        get() {
          return _lndconnectQRCode.get(this)
        },
      },

      isReady: {
        enumerable: false,
        get() {
          return _isReady.get(this)
        },
      },
      lndDir: {
        enumerable: true,
        get() {
          if (this.type === LNDCONFIG_TYPE_LOCAL) {
            return join(options.userDataDir, 'lnd', this.chain, this.network, this.wallet)
          }
        },
      },
      host: {
        enumerable: true,
        set(host) {
          return this.setConnectionProp('host', host)
        },
        get() {
          return this.getConnectionProp('host')
        },
      },
      cert: {
        enumerable: true,
        set(cert) {
          return this.setConnectionProp('cert', cert)
        },
        get() {
          return this.getConnectionProp('cert')
        },
      },
      macaroon: {
        enumerable: true,
        set(macaroon) {
          return this.setConnectionProp('macaroon', macaroon)
        },
        get() {
          return this.getConnectionProp('macaroon')
        },
      },
    })

    // Assign default options.
    this.type = 'local'
    this.chain = config.chain
    this.network = config.network

    // Set base config.
    const baseConfig = pick(options, [
      'id',
      'type',
      'chain',
      'network',
      'decoder',
      'binaryPath',
      'protoDir',
    ])
    Object.assign(this, baseConfig)

    // Retrieve default autopilot config.
    const {
      autopilot: {
        active: autopilot,
        private: autopilotPrivate,
        maxchannels: autopilotMaxchannels,
        minchansize: autopilotMinchansize,
        maxchansize: autopilotMaxchansize,
        allocation: autopilotAllocation,
        minconfs: autopilotMinconfs,
      },
      assumechanvalid,
    } = config.lnd

    // Assign default settings.
    const lndDefaults = {
      name: null,
      alias: null,
      autopilot,
      autopilotPrivate,
      autopilotMaxchannels,
      autopilotMinchansize,
      autopilotMaxchansize,
      autopilotAllocation,
      autopilotMinconfs,
      assumechanvalid,
    }
    // Merge in whitelisted settings.
    const userSettings = pick(options, Object.keys(lndDefaults))
    const settings = { ...lndDefaults, ...userSettings }
    debug('Applying settings as: %o', settings)
    Object.assign(this, settings)

    // In order to calculate the `lndconnect` property value we must perform some async operations. This prevents us
    // from being able to set the value directly in the constructor as we do for all the other properties. So, we define
    // a `ready` property that resolves once we have calculated this value so that users of this class to wait until the
    // `ready` property has been resolved before using the class instance in order to ensure that the instance has been
    // fully instantiated.
    const isReady = async () => {
      try {
        // Generate lndConenct uri.
        const lndconnectUri = await this.generateLndconnectUri(options)
        if (lndconnectUri) {
          debug('Generated lndconnectUri: %s', lndconnectUri)
          this.lndconnectUri = lndconnectUri
        }
        // Generate lndConenct QR code..
        if (this.lndconnectUri) {
          const lndconnectQRCode = await this.generateLndconnectQRCode()
          _lndconnectQRCode.set(this, lndconnectQRCode)
        }
        return true
      } catch (e) {
        mainLog.error('Unable to generate lndconnect uri: %o', e)
        return true
      }
    }
    _isReady.set(this, isReady())
  }

  /**
   * generateLndconnectUri - Generate an lndconnect uri based on the config options.
   *
   * @param {*} options Lnd config options
   * @returns {string} Lndconnect uri
   */
  async generateLndconnectUri(options) {
    const { lndconnectUri } = options
    let { host, cert, macaroon } = options

    // If this is a local wallet, set the lnd connection details based on wallet config.
    if (this.type === LNDCONFIG_TYPE_LOCAL) {
      host = await getLndListen('rpc')
      cert = join(this.lndDir, 'tls.cert')
      macaroon = join(this.lndDir, 'data', 'chain', this.chain, this.network, 'admin.macaroon')
      return lndconnect.encode({ host, cert, macaroon })
    }

    // If lndconnectUri is provided, use it as is.
    if (lndconnectUri) {
      return lndconnectUri
    }

    // If this is a custom type, assign the host, cert, and macaroon. This will generate the lndconnectUri.
    if (this.type === LNDCONFIG_TYPE_CUSTOM) {
      return lndconnect.encode({ host, cert, macaroon })
    }
  }

  /**
   * generateLndconnectQRCode - Generate a flattened lnd connect uri.
   *
   * This will follow any filepaths, read the files and add the decoded content.
   *
   * @returns {string} Embedded lndconnect uri.
   */
  async generateLndconnectQRCode() {
    const { decoder, lndconnectUri } = this
    switch (decoder) {
      case 'lnd.lndconnect.v1':
        if (lndconnectUri) {
          return LndConfig.qrcodeFromLndconnectUri(lndconnectUri)
        }
        break

      default:
        return null
    }
  }

  /**
   * setConnectionProp - Setter helper for connection properties.
   *
   * @param {string} key key
   * @param {string} value Value
   */
  setConnectionProp(key, value) {
    if (this.decoder === 'lnd.lndconnect.v1') {
      const decoded = lndconnect.decode(this.lndconnectUri)
      this.lndconnectUri = lndconnect.encode({ ...decoded, [key]: safeTildify(safeTrim(value)) })
    }
  }

  /**
   * getConnectionProp - Getter helper for connection keyerties.
   *
   * @param {string} key key
   * @returns {string} Value
   */
  getConnectionProp(key) {
    if (this.decoder === 'lnd.lndconnect.v1') {
      const decoded = lndconnect.decode(this.lndconnectUri)
      return safeUntildify(decoded[key])
    }
  }

  /**
   * qrcodeFromLndconnectUri - Generate an lndconnect QR code from an lndconenctUri.
   *
   * @param {string} lndconnectUri Lndconnect Uri
   * @returns {string} Embedded lndconnect uri
   */
  static async qrcodeFromLndconnectUri(lndconnectUri) {
    const { host, cert, macaroon } = lndconnect.decode(lndconnectUri)
    const expandedCert = safeUntildify(cert)
    const expandedMacaroon = safeUntildify(macaroon)
    const [certData, macaroonData] = await Promise.all([
      isAbsolute(expandedCert) ? readFile(expandedCert) : expandedCert,
      isAbsolute(expandedMacaroon) ? readFile(expandedMacaroon) : expandedMacaroon,
    ])
    return lndconnect.encode({ host, cert: certData, macaroon: macaroonData })
  }
}

export default LndConfig

import fs from 'fs'
import { tmpdir } from 'os'
import { join, isAbsolute } from 'path'
import util from 'util'

import config from 'config'
import createDebug from 'debug'
import lndconnect from 'lndconnect'
import get from 'lodash/get'
import pick from 'lodash/pick'
import tildify from 'tildify'
import untildify from 'untildify'

import getLndListen from '@zap/utils/getLndListen'
import { mainLog } from '@zap/utils/log'

const readFile = util.promisify(fs.readFile)

const debug = createDebug('zap:lnd-config')

const LNDCONFIG_TYPE_LOCAL = 'local'
const LNDCONFIG_TYPE_CUSTOM = 'custom'
const TEMP_WALLET_ID = 'tmp'
const TEMP_WALLET_DIR = 'zap-tmp-wallet'

// Private properties for `LndConfig` instances.
const isReadyStore = new WeakMap()
const lndconnectQRCodeStore = new WeakMap()
const tmpDirStore = new WeakMap()

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
          return lndconnectQRCodeStore.get(this)
        },
      },

      isReady: {
        enumerable: false,
        get() {
          return isReadyStore.get(this)
        },
      },
      isTemporary: {
        enumerable: true,
        get() {
          return this.id === TEMP_WALLET_ID
        },
      },
      lndDir: {
        enumerable: true,
        get() {
          if (this.isTemporary) {
            const cache = tmpDirStore.get(this)
            if (cache) {
              return cache
            }
            const lndDir = fs.mkdtempSync(join(tmpdir(), TEMP_WALLET_DIR))
            tmpDirStore.set(this, lndDir)
            return lndDir
          }
          if (this.type === LNDCONFIG_TYPE_LOCAL) {
            return join(options.userDataDir, 'lnd', this.chain, this.network, this.wallet)
          }
          return null
        },
      },
      host: {
        enumerable: true,
        set(host) {
          this.setConnectionProp('host', host)
        },
        get() {
          return this.getConnectionProp('host')
        },
      },
      cert: {
        enumerable: true,
        set(cert) {
          this.setConnectionProp('cert', cert)
        },
        get() {
          return this.getConnectionProp('cert')
        },
      },
      macaroon: {
        enumerable: true,
        set(macaroon) {
          this.setConnectionProp('macaroon', macaroon)
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
      whitelistPeers,
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
      whitelistPeers,
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
    const completeSetup = async () => {
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
          lndconnectQRCodeStore.set(this, lndconnectQRCode)
        }
        return true
      } catch (e) {
        mainLog.error('Unable to generate lndconnect uri: %o', e)
        return true
      }
    }

    isReadyStore.set(this, completeSetup())
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

    return null
  }

  /**
   * generateLndconnectQRCode - Generate a flattened lnd connect uri.
   *
   * This will follow any filepaths, read the files and add the decoded content.
   *
   * @returns {string} Embedded lndconnect uri.
   */
  async generateLndconnectQRCode() {
    // Temporary wallets are only used for the purpose of generating a new seed and will not support QR code generation
    // as they will never be running long enough to have a certificate or macaroon generated.
    if (this.isTemporary) {
      return null
    }

    const { decoder, lndconnectUri } = this
    switch (decoder) {
      case 'lnd.lndconnect.v1':
        if (lndconnectUri) {
          return LndConfig.qrcodeFromLndconnectUri(lndconnectUri)
        }
        return null

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
   * getConnectionProp - Getter helper for connection key entries.
   *
   * @param {string} key key
   * @returns {string} Value
   */
  getConnectionProp(key) {
    if (this.decoder === 'lnd.lndconnect.v1') {
      const decoded = lndconnect.decode(this.lndconnectUri)
      return safeUntildify(decoded[key])
    }
    return null
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

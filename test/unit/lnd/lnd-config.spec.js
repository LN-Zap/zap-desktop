// @flow

import { join, normalize } from 'path'
import Store from 'electron-store'
import LndConfig from 'lib/lnd/config'

jest.mock('grpc')

jest.mock('electron', () => {
  const { normalize } = require('path')

  return {
    app: {
      getPath: name => normalize(`/tmp/zap-test/${name}`),
      getAppPath: () => normalize('/tmp/zap-test')
    }
  }
})

jest.mock('lib/lnd/util', () => {
  const { normalize } = require('path')

  return {
    ...jest.requireActual('lib/lnd/util'),
    appRootPath: normalize('/tmp/zap-test/app/root'),
    binaryName: 'binaryName',
    binaryPath: 'binaryPath'
  }
})

Store.prototype.set = jest.fn()

describe('LndConfig', function() {
  const checkForStaticProperties = () => {
    it('should have "binaryPath" set to the value returned by lib/lnd/util', () => {
      expect(this.lndConfig.binaryPath).toEqual('binaryPath')
    })
    it('should have "configPath" set to "resources/lnd.conf" relative to app root from lib/lnd/util"', () => {
      expect(this.lndConfig.configPath).toEqual(
        normalize('/tmp/zap-test/app/root/resources/lnd.conf')
      )
    })
    it('should have "rpcProtoPath" set to "resources/rcp.proto" relative to app root from lib/lnd/util"', () => {
      expect(this.lndConfig.rpcProtoPath).toEqual(
        normalize('/tmp/zap-test/app/root/resources/rpc.proto')
      )
    })
  }

  const checkForConfigProperties = type => {
    it(`should have the "type" property set to the ${type} value`, () => {
      expect(this.lndConfig.type).toEqual(this.type)
    })
    it(`should have the "currency" property set to the ${type} value`, () => {
      expect(this.lndConfig.currency).toEqual(this.currency)
    })
    it(`should have the "network" property set to the ${type}`, () => {
      expect(this.lndConfig.network).toEqual(this.network)
    })
    it(`should have the "wallet" property set to the ${type}`, () => {
      expect(this.lndConfig.wallet).toEqual(this.wallet)
    })
    it(`should have the "dataDir" set to a path derived from the config, under the app userData dir`, () => {
      const baseDir = '/tmp/zap-test/userData/lnd/'
      const expectedDataDir = join(baseDir, this.currency, this.network, this.wallet)
      expect(this.lndConfig.dataDir).toEqual(expectedDataDir)
    })
  }

  const checkForLoadedProperties = () => {
    it(`should have the "host" property set to the default value`, () => {
      expect(this.lndConfig.host).toEqual(this.host)
    })
    it('should have the "cert" property set to a path relative to the datadir', () => {
      expect(this.lndConfig.cert).toEqual(this.cert)
    })
    it('should have the "macaroon" property set to a path relative to the datadir', () => {
      expect(this.lndConfig.macaroon).toEqual(this.macaroon)
    })
  }

  const checkForSaveBehaviour = expectedData => {
    it('should save the config to a file', () => {
      expect(Store.prototype.set).toHaveBeenCalledWith(
        `${this.type}.${this.currency}.${this.network}.${this.wallet}`,
        expectedData
      )
    })
  }

  describe('"local" type', () => {
    describe('New config with default options', () => {
      beforeAll(() => {
        this.type = 'local'
        this.currency = 'bitcoin'
        this.network = 'testnet'
        this.wallet = 'wallet-1'

        this.lndConfig = new LndConfig()

        this.host = 'localhost:10009'
        this.cert = join(this.lndConfig.dataDir, 'tls.cert')
        this.macaroon = join(this.lndConfig.dataDir, 'admin.macaroon')
      })

      describe('static properties', () => {
        checkForStaticProperties()
      })
      describe('config properties', () => {
        checkForConfigProperties('default')
      })
      describe('.load()', () => {
        beforeAll(() => this.lndConfig.load())
        checkForLoadedProperties()
      })
      describe('.save() - no settings', () => {
        beforeAll(() => this.lndConfig.save())
        checkForSaveBehaviour({})
      })
      describe('.save() - with settings', () => {
        beforeAll(() => {
          this.lndConfig.alias = 'some-alias1'
          this.lndConfig.autopilot = true
          this.lndConfig.save()
        })
        checkForSaveBehaviour({ alias: 'some-alias1', autopilot: true })
      })
    })

    describe('New config with provided options', () => {
      beforeAll(() => {
        this.type = 'local'
        this.currency = 'litecoin'
        this.network = 'mainnet'
        this.wallet = 'wallet-2'

        this.lndConfig = new LndConfig({
          type: this.type,
          currency: this.currency,
          network: this.network,
          wallet: this.wallet
        })

        this.host = 'localhost:10009'
        this.cert = join(this.lndConfig.dataDir, 'tls.cert')
        this.macaroon = join(this.lndConfig.dataDir, 'admin.macaroon')
      })

      describe('static properties', () => {
        checkForStaticProperties()
      })
      describe('config properties', () => {
        checkForConfigProperties('provided')
      })
      describe('.load()', () => {
        beforeAll(() => this.lndConfig.load())
        checkForLoadedProperties()
      })
      describe('.save() - no settings', () => {
        beforeAll(() => this.lndConfig.save())
        checkForSaveBehaviour({})
      })
      describe('.save() - with settings', () => {
        beforeAll(() => {
          this.lndConfig.alias = 'some-alias2'
          this.lndConfig.autopilot = true
          this.lndConfig.save()
        })
        checkForSaveBehaviour({ alias: 'some-alias2', autopilot: true })
      })
    })

    describe('New config with provided options and initial configuration', () => {
      beforeAll(() => {
        this.type = 'custom'
        this.currency = 'bitcoin'
        this.network = 'testnet'
        this.wallet = 'wallet-1'
        this.host = 'some-host'
        this.cert = 'some-cert'
        this.macaroon = 'some-macaroon'

        this.lndConfig = new LndConfig({
          type: this.type,
          currency: this.currency,
          network: this.network,
          wallet: this.wallet,
          settings: {
            host: this.host,
            cert: this.cert,
            macaroon: this.macaroon
          }
        })
      })

      describe('static properties', () => {
        checkForStaticProperties()
      })
      describe('config properties', () => {
        checkForConfigProperties('provided')
      })
      describe('.save()', () => {
        beforeAll(() => this.lndConfig.save())
        checkForSaveBehaviour({ host: 'some-host', cert: 'some-cert', macaroon: 'some-macaroon' })
      })
    })
  })
})

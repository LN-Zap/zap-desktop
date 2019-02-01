// @flow

import { join, normalize } from 'path'
import LndConfig from 'lib/lnd/config'

jest.mock('lib/lnd/util', () => {
  return {
    ...jest.requireActual('lib/lnd/util'),
    binaryName: 'binaryName',
    binaryPath: () => 'binaryPath'
  }
})

describe('LndConfig', function() {
  const checkForStaticProperties = () => {
    it('should have "binaryPath" set to the value returned by lib/lnd/util', () => {
      expect(this.lndConfig.binaryPath).toEqual('binaryPath')
    })
    it('should have "configPath" set to "resources/lnd.conf" relative to app root from lib/lnd/util"', () => {
      expect(this.lndConfig.configPath).toEqual(
        normalize(`${__dirname}/../../../resources/lnd.conf`)
      )
    })
  }

  const checkForConfigProperties = type => {
    it(`should have the "type" property set to the ${type} value`, () => {
      expect(this.lndConfig.type).toEqual(this.type)
    })
    it(`should have the "chain" property set to the ${type} value`, () => {
      expect(this.lndConfig.chain).toEqual(this.chain)
    })
    it(`should have the "network" property set to the ${type}`, () => {
      expect(this.lndConfig.network).toEqual(this.network)
    })
    it(`should have the "wallet" property set to the ${type}`, () => {
      expect(this.lndConfig.wallet).toEqual(this.wallet)
    })
    it(`should have the "lndDir" set to a path derived from the config, under the app userData dir`, () => {
      const baseDir = '/tmp/zap-test/userData/lnd/'
      const expectedDataDir = join(baseDir, this.chain, this.network, this.wallet)
      expect(this.lndConfig.lndDir).toEqual(expectedDataDir)
    })
  }

  describe('"local" type', () => {
    describe('New config with provided options', () => {
      beforeAll(() => {
        this.wallet = 'wallet-1'
        this.type = 'local'
        this.chain = 'litecoin'
        this.network = 'mainnet'

        this.lndConfig = new LndConfig({
          id: 1,
          type: this.type,
          chain: this.chain,
          network: this.network
        })
      })

      describe('static properties', () => {
        checkForStaticProperties()
      })
      describe('config properties', () => {
        checkForConfigProperties('provided')
      })
    })

    describe('New config with provided options and initial configuration', () => {
      beforeAll(() => {
        this.wallet = 'wallet-1'
        this.type = 'local'
        this.chain = 'bitcoin'
        this.network = 'testnet'
        this.host = 'some-host'
        this.cert = 'some-cert'
        this.macaroon = 'some-macaroon'

        this.lndConfig = new LndConfig({
          id: 1,
          type: this.type,
          chain: this.chain,
          network: this.network,
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
    })
  })
})

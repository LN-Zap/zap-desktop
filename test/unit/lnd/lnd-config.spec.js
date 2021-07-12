import { join } from 'path'

import LndConfig from '@zap/utils/lndConfig'

const userDataDir = '/some/data/dir'
const binaryPath = '/some/bin/dir'

const lndOptions = {
  userDataDir,
  binaryPath,
}

describe('LndConfig', function testLndConfig() {
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
      const baseDir = userDataDir
      const expectedDataDir = join(baseDir, 'lnd', this.chain, this.network, this.wallet)
      expect(this.lndConfig.lndDir).toEqual(expectedDataDir)
    })
  }

  describe('"local" type', () => {
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
          ...lndOptions,
          id: 1,
          type: this.type,
          chain: this.chain,
          network: this.network,
          host: this.host,
          cert: this.cert,
          macaroon: this.macaroon,
        })
      })

      checkForConfigProperties('provided')
    })
  })
})

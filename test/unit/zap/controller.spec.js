import ZapController from 'lib/zap/controller'
import LndConfig from 'lib/lnd/config'
import Lightning from 'lib/lnd/lightning'

jest.mock('lib/lnd/lightning')

describe('ZapController', function() {
  describe('Constructor', () => {
    beforeAll(() => {
      this.controller = new ZapController()
    })

    describe('initial values', () => {
      it('should set the "lndConfig" property to a new LndConfig instance', () => {
        expect(this.controller.lndConfig).toBeInstanceOf(LndConfig)
      })
      it('should set the "splashScreenTime" property to 500', () => {
        expect(this.controller.splashScreenTime).toEqual(1500)
      })
      it('should set the "mainWindow" property to undefined', () => {
        expect(this.controller.mainWindow).toBeUndefined()
      })
    })
  })

  describe('.startLightningWallet', () => {
    describe('successful connection', () => {
      beforeEach(() => {
        Lightning.mockImplementation(() => ({
          subscribe: jest.fn(),
          connect: jest.fn().mockResolvedValue()
        }))
        this.controller = new ZapController()
      })
      it('should resolve with undefined', async () => {
        await expect(this.controller.startLightningWallet()).resolves.toBeUndefined()
        expect(this.controller.lightning.subscribe).toHaveBeenCalled()
      })
    })
    describe('unsuccessful connection', () => {
      beforeEach(() => {
        Lightning.mockImplementation(() => ({
          subscribe: jest.fn(),
          connect: jest.fn().mockRejectedValue(new Error('Async error'))
        }))
        this.controller = new ZapController()
      })
      it('should reject an error', async () => {
        await expect(this.controller.startLightningWallet()).rejects.toThrow('Async error')
        expect(this.controller.lightning.subscribe).not.toHaveBeenCalled()
      })
    })
  })
})

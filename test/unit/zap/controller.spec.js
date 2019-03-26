import ZapController from '@zap/electron/controller'
import Lightning from '@zap/lnd/lightning'

jest.mock('@zap/lnd/lightning')

describe('ZapController', function() {
  describe('Constructor', () => {
    beforeAll(() => {
      this.controller = new ZapController()
    })

    describe('initial values', () => {
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
          connect: jest.fn().mockResolvedValue(),
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
          connect: jest.fn().mockRejectedValue(new Error('Async error')),
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

import { BrowserWindow } from 'electron'
import Lightning from 'lib/lnd/lightning'

jest.mock('lib/lnd/subscribe/transactions')
jest.mock('lib/lnd/subscribe/invoices')
jest.mock('lib/lnd/subscribe/channelgraph')

describe('Lightning', function() {
  describe('Constructor', () => {
    beforeAll(() => (this.lightning = new Lightning()))

    describe('initial values', () => {
      it('should set the "mainWindow" property to null', () => {
        expect(this.lightning.mainWindow).toBeNull()
      })
      it('should set the "lnd" property to null', () => {
        expect(this.lightning.service).toBeNull()
      })
      it('should initialise the "subscriptions" object with null values', () => {
        expect(this.lightning.subscriptions).toMatchObject({
          channelGraph: null,
          invoices: null,
          transactions: null,
        })
      })
    })
  })

  describe('subscribe()', () => {
    beforeAll(() => {
      this.window = new BrowserWindow({})
      this.lightning = new Lightning()
      this.lightning.subscribe(this.window)
    })

    it('should assign the window to the "mainWindow" property', () => {
      expect(this.lightning.mainWindow).toBe(this.window)
    })
  })

  describe('unsubscribe()', () => {
    beforeAll(() => {
      this.lightning = new Lightning()
      this.lightning.mainWindow = new BrowserWindow({})
      this.lightning.unsubscribe()
    })

    it('should unassign the "mainWindow" property', () => {
      expect(this.lightning.mainWindow).toBeNull()
    })
  })
})

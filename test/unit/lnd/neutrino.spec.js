// @flow

import Neutrino from 'lib/lnd/neutrino'
import LndConfig from 'lib/lnd/config'
import mockSpawn from 'mock-spawn'

jest.mock('electron-store')
jest.mock('child_process', () => {
  var mockSpawn = require('mock-spawn')
  return {
    spawn: mockSpawn()
  }
})

describe('Neutrino', function() {
  describe('Constructor', () => {
    beforeAll(() => {
      this.neutrino = new Neutrino(new LndConfig())
    })

    describe('initial values', () => {
      it('should set the "process" property to null', () => {
        expect(this.neutrino.process).toEqual(null)
      })
      it('should set the "walletUnlockerGrpcActive" property to false', () => {
        expect(this.neutrino.walletUnlockerGrpcActive).toEqual(false)
      })
      it('should set the "lightningGrpcActive" property to false', () => {
        expect(this.neutrino.lightningGrpcActive).toEqual(false)
      })
      it('should set the "chainSyncStatus" property to "chain-sync-pending"', () => {
        expect(this.neutrino.chainSyncStatus).toEqual('chain-sync-pending')
      })
      it('should set the "currentBlockHeight" property to 0', () => {
        expect(this.neutrino.currentBlockHeight).toEqual(0)
      })
      it('should set the "lndBlockHeight" property to 0', () => {
        expect(this.neutrino.lndBlockHeight).toEqual(0)
      })
      it('should set the "lndCfilterHeight" property to 0', () => {
        expect(this.neutrino.lndCfilterHeight).toEqual(0)
      })
      it('should set the "lastError" property to be null', () => {
        expect(this.neutrino.lastError).toEqual(null)
      })
    })
  })

  describe('.setState', () => {
    describe('called with new state', () => {
      beforeEach(() => {
        this.neutrino = new Neutrino(new LndConfig())
        this.callback = jest.fn()
        this.newVal = 'chain-sync-finished'
        this.neutrino.on('chain-sync-finished', this.callback)
        this.neutrino.setState(this.newVal)
      })

      it('should set the state', () => {
        expect(this.neutrino.chainSyncStatus).toEqual(this.newVal)
      })
      it('should emit an event with the new state name', () => {
        expect(this.callback).toHaveBeenCalledTimes(1)
      })
    })
    describe('called with current state', () => {
      beforeEach(() => {
        this.neutrino = new Neutrino(new LndConfig())
        this.callback = jest.fn()
        this.newVal = 'chain-sync-pending'
        this.neutrino.on('chain-sync-pending', this.callback)
        this.neutrino.setState(this.newVal)
      })

      it('should not change the state', () => {
        expect(this.neutrino.chainSyncStatus).toEqual(this.newVal)
      })
      it('should not emit an event with the new state name', () => {
        expect(this.callback).not.toHaveBeenCalled()
      })
    })
  })

  describe('.setCurrentBlockHeight', () => {
    describe('called with higher height', () => {
      beforeEach(() => {
        this.neutrino = new Neutrino(new LndConfig())
        this.callback = jest.fn()
        this.newVal = 100
        this.neutrino.on('got-current-block-height', this.callback)
        this.neutrino.setCurrentBlockHeight(this.newVal)
      })

      it('should change the current block height', () => {
        expect(this.neutrino.currentBlockHeight).toEqual(this.newVal)
      })
      it('should emit an event with the new current block height', () => {
        expect(this.callback).toHaveBeenCalledTimes(1)
        expect(this.callback).toHaveBeenCalledWith(this.newVal)
      })
    })
    describe('called with lower height', () => {
      beforeEach(() => {
        this.neutrino = new Neutrino(new LndConfig())
        this.callback = jest.fn()
        this.newVal = -1
        this.neutrino.on('got-current-block-height', this.callback)
        this.neutrino.setCurrentBlockHeight(this.newVal)
      })

      it('should not change the current block height', () => {
        expect(this.neutrino.currentBlockHeight).toEqual(0)
      })
      it('should not emit an event with the new current block height', () => {
        expect(this.callback).not.toHaveBeenCalled()
      })
    })
  })

  describe('.setLndBlockHeight', () => {
    describe('called with higher height', () => {
      beforeEach(() => {
        this.neutrino = new Neutrino(new LndConfig())
        this.callback = jest.fn()
        this.newVal = 100
        this.neutrino.on('got-lnd-block-height', this.callback)
        this.neutrino.setCurrentBlockHeight = jest.fn()
        this.neutrino.setLndBlockHeight(this.newVal)
      })

      it('should change the lnd block height', () => {
        expect(this.neutrino.lndBlockHeight).toEqual(this.newVal)
      })
      it('should emit an event with the new lnd block height', () => {
        expect(this.callback).toHaveBeenCalledTimes(1)
        expect(this.callback).toHaveBeenCalledWith(this.newVal)
      })
      it('should call this.setCurrentBlockHeight', () => {
        expect(this.neutrino.setCurrentBlockHeight).toHaveBeenCalledTimes(1)
        expect(this.neutrino.setCurrentBlockHeight).toHaveBeenCalledWith(this.newVal)
      })
    })
    describe('called with lower height', () => {
      beforeEach(() => {
        this.neutrino = new Neutrino(new LndConfig())
        this.callback = jest.fn()
        this.newVal = -1
        this.neutrino.on('got-lnd-block-height', this.callback)
        this.neutrino.setLndBlockHeight(this.newVal)
        this.neutrino.setCurrentBlockHeight = jest.fn()
      })

      it('should not change the lnd block height', () => {
        expect(this.neutrino.lndBlockHeight).toEqual(0)
      })
      it('should not emit an event with the new lnd block height', () => {
        expect(this.callback).not.toHaveBeenCalled()
      })
      it('should not call this.setCurrentBlockHeight', () => {
        expect(this.neutrino.setCurrentBlockHeight).not.toHaveBeenCalled()
      })
    })
  })

  describe('.is', () => {
    describe('called with current state', () => {
      beforeEach(() => {
        this.neutrino = new Neutrino(new LndConfig())
      })

      it('should returnn true if the current state matches', () => {
        expect(this.neutrino.is('chain-sync-pending')).toEqual(true)
      })
      it('should return false if the current state does not matche', () => {
        expect(this.neutrino.is('some-other-state')).toEqual(false)
      })
    })
  })

  describe('.start', () => {
    describe('called when neutrino is not running', () => {
      beforeEach(() => {
        this.neutrino = new Neutrino(new LndConfig())
        this.neutrino.start()
      })
      it('should set the subprocess object on the `process` property', () => {
        expect(this.neutrino.process.pid).toBeDefined()
      })
    })

    describe('called when neutrino is already running', () => {
      beforeEach(() => {
        this.neutrino = new Neutrino(new LndConfig())
        this.neutrino.process = mockSpawn()
      })
      it('should throw an error', () => {
        expect(() => {
          this.neutrino.start()
        }).toThrow()
      })
    })
  })
})

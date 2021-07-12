import mockSpawn from 'mock-spawn'

import Neutrino from '@zap/services/neutrino'
import LndConfig from '@zap/utils/lndConfig'

jest.mock('child_process', () => {
  /* eslint-disable global-require */
  const mockSpawn = require('mock-spawn') /* eslint-disable-line no-shadow */
  return {
    spawn: mockSpawn(),
  }
})

const userDataDir = '/some/data/dir'
const binaryPath = '/some/bin/dir'

const lndOptions = {
  userDataDir,
  binaryPath,
}

const lndConfigOptions = {
  ...lndOptions,
  type: 'local',
  chain: 'bitcoin',
  network: 'testnet',
}

const prepareLndConfig = async options => {
  const config = new LndConfig(options)
  await config.isReady
  const neutrino = new Neutrino()
  neutrino.init(config)
  return neutrino
}

describe('Neutrino', function testNeutrino() {
  describe('Constructor', () => {
    beforeAll(async () => {
      this.neutrino = await prepareLndConfig(lndConfigOptions)
    })

    describe('initial values', () => {
      it('should set the "process" property to null', () => {
        expect(this.neutrino.process).toEqual(null)
      })
      it('should set the "isWalletUnlockerGrpcActive" property to false', () => {
        expect(this.neutrino.isWalletUnlockerGrpcActive).toEqual(false)
      })
      it('should set the "isLightningGrpcActive" property to false', () => {
        expect(this.neutrino.isLightningGrpcActive).toEqual(false)
      })
      it('should set the "chainSyncStatus" property to "NEUTRINO_CHAIN_SYNC_PENDING"', () => {
        expect(this.neutrino.chainSyncStatus).toEqual('NEUTRINO_CHAIN_SYNC_PENDING')
      })
      it('should set the "currentBlockHeight" property to 0', () => {
        expect(this.neutrino.currentBlockHeight).toEqual(0)
      })
      it('should set the "neutrinoBlockHeight" property to 0', () => {
        expect(this.neutrino.neutrinoBlockHeight).toEqual(0)
      })
      it('should set the "neutrinoCfilterHeight" property to 0', () => {
        expect(this.neutrino.neutrinoCfilterHeight).toEqual(0)
      })
      it('should set the "lastError" property to be null', () => {
        expect(this.neutrino.lastError).toEqual(null)
      })
    })
  })

  describe('.setState', () => {
    describe('called with new state', () => {
      beforeEach(async () => {
        this.neutrino = await prepareLndConfig(lndConfigOptions)
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
      beforeEach(async () => {
        this.neutrino = await prepareLndConfig(lndConfigOptions)
        this.callback = jest.fn()
        this.newVal = 'NEUTRINO_CHAIN_SYNC_PENDING'
        this.neutrino.on('NEUTRINO_CHAIN_SYNC_PENDING', this.callback)
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
      beforeEach(async () => {
        this.neutrino = await prepareLndConfig(lndConfigOptions)
        this.callback = jest.fn()
        this.newVal = 100
        this.neutrino.on('NEUTRINO_GOT_CURRENT_BLOCK_HEIGHT', this.callback)
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
      beforeEach(async () => {
        this.neutrino = await prepareLndConfig(lndConfigOptions)
        this.callback = jest.fn()
        this.newVal = -1
        this.neutrino.on('NEUTRINO_GOT_CURRENT_BLOCK_HEIGHT', this.callback)
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

  describe('.setNeutrinoBlockHeight', () => {
    describe('called with higher height', () => {
      beforeEach(async () => {
        this.neutrino = await prepareLndConfig(lndConfigOptions)
        this.callback = jest.fn()
        this.newVal = 100
        this.neutrino.on('NEUTRINO_GOT_LND_BLOCK_HEIGHT', this.callback)
        this.neutrino.setCurrentBlockHeight = jest.fn()
        this.neutrino.setNeutrinoBlockHeight(this.newVal)
      })

      it('should change the lnd block height', () => {
        expect(this.neutrino.neutrinoBlockHeight).toEqual(this.newVal)
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
      beforeEach(async () => {
        this.neutrino = await prepareLndConfig(lndConfigOptions)
        this.callback = jest.fn()
        this.newVal = -1
        this.neutrino.on('NEUTRINO_GOT_CURRENT_BLOCK_HEIGHT', this.callback)
        this.neutrino.setNeutrinoBlockHeight(this.newVal)
        this.neutrino.setCurrentBlockHeight = jest.fn()
      })

      it('should not change the lnd block height', () => {
        expect(this.neutrino.neutrinoBlockHeight).toEqual(0)
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
      beforeEach(async () => {
        this.neutrino = await prepareLndConfig(lndConfigOptions)
      })

      it('should returnn true if the current state matches', () => {
        expect(this.neutrino.is('NEUTRINO_CHAIN_SYNC_PENDING')).toEqual(true)
      })
      it('should return false if the current state does not matche', () => {
        expect(this.neutrino.is('some-other-state')).toEqual(false)
      })
    })
  })

  describe('.start', () => {
    describe('called when neutrino is not running', () => {
      beforeEach(async () => {
        this.neutrino = await prepareLndConfig(lndConfigOptions)
        await this.neutrino.start()
      })
      it('should set the subprocess object on the `process` property', () => {
        expect(this.neutrino.process.pid).toBeDefined()
      })
    })

    describe('called when neutrino is already running', () => {
      beforeEach(async () => {
        this.neutrino = await prepareLndConfig(lndConfigOptions)
        this.neutrino.process = mockSpawn()
        this.neutrino.process.pid = 123
      })
      it('should throw an error', async () => {
        await expect(this.neutrino.start()).rejects.toThrowErrorMatchingInlineSnapshot(
          `"Neutrino process with PID ${this.neutrino.process.pid} already exists."`
        )
      })
    })
  })
})

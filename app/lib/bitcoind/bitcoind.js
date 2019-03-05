// @flow

import bitcoind from 'bitcoind'
import split2 from 'split2'
import EventEmitter from 'events'
import { mainLog } from '../utils/log'

// Sync statuses
const CHAIN_SYNC_WAITING = 'chain-sync-waiting'
const CHAIN_SYNC_IN_PROGRESS = 'chain-sync-started'
const CHAIN_SYNC_COMPLETE = 'chain-sync-finished'

// Events
const ERROR = 'error'
const EXIT = 'exit'
const BITCOIND_GRPC_ACTIVE = 'bitcoind-grpc-active'
const GOT_BITCOIND_CURRENT_BLOCK_HEIGHT = 'got-bitcoind-current-block-height'

/**
 * Wrapper class for Bitcoind to run and monitor it in Mainnet mode.
 * @extends EventEmitter
 */
class Bitcoind extends EventEmitter {
  process: any
  bitcoindGrpcActive: boolean
  chainSyncStatus: string
  currentBlockHeight: number
  lastError: ?string

  constructor() {
    super()
    this.process = null
    this.chainSyncStatus = CHAIN_SYNC_WAITING
    this.currentBlockHeight = 0
    this.lastError = null
  }

  static incrementIfHigher(context: any, property: string, newVal: any) {
    const { [property]: oldVal } = context
    if (newVal > oldVal) {
      context[property] = newVal
      return true
    }
    return false
  }

  /**
   * Start the Bitcoind process in Mainnet mode.
   */
  async start() {
    if (this.process) {
      return Promise.reject(new Error('Bitcoind process already exists.'))
    }

    mainLog.info('Starting bitcoind in mainnet mode')

    // spawn bitcoind process
    this.process = bitcoind({
      datadir: __dirname + '/Bitcoin',
      server: 1,
      rpcuser: 'kek',
      rpcpassword: 'kek',
      zmqpubrawblock: 'tcp://127.0.0.1:28332',
      zmqpubrawtx: 'tcp://127.0.0.1:28333'
    })
      .on('error', error => {
        mainLog.debug('Mainnet process received "error" event with error: %s', error)
        this.emit(ERROR, error, this.lastError)
      })
      .on('exit', (code, signal) => {
        mainLog.debug(
          'Mainnet process received "exit" event with code %s and signal %s',
          code,
          signal
        )
        this.emit(EXIT, code, signal, this.lastError)
        this.process = null
      })

    // Listen for when bitcoind prints data to stderr
    this.process.stderr.pipe(split2()).on('data', line => {
      this.lastError = line
    })

    // listen for when bitcoind prints data to stdout
    this.process.stdout.pipe(split2()).on('data', line => {
      // console.log('--------', line)

      // RPC server listening
      if (line.includes('init message: Done loading')) {
        this.bitcoindGrpcActive = true
        this.emit(BITCOIND_GRPC_ACTIVE)
      }

      // If the sync has already completed then we don't need to do anything else.
      if (this.is(CHAIN_SYNC_COMPLETE)) {
        return
      }

      // if we are still waiting for the backend to finish syncing
      if (this.is(CHAIN_SYNC_IN_PROGRESS)) {
        if (line.includes('progress=')) {
          this.setState(CHAIN_SYNC_WAITING)
        }
      }

      // Bitcoind syncing has started or resumed
      if (this.is(CHAIN_SYNC_WAITING)) {
        const match = line.match(/height=(\d+)/)

        if (match) {
          // This is the lastest block that Bitcoind is aware of
          const bitcoindHeight = match[1]
          this.setCurrentBlockHeight(bitcoindHeight)
        }
      }

      // Bitcoind syncing has completed
      if (line.includes('P2P peers available')) {
        this.setState(CHAIN_SYNC_COMPLETE)
      }
    })
  }

  /**
   * Stop the bitcond process.
   */
  kill(signalName) {
    if (this.process) {
      mainLog.info('Killing Bitcoind process...')
      this.process.kill(signalName)
    }
  }

  /**
   * Check if the current state matches the passted in state.
   * @param  {String} state State to compare against the current state.
   * @return {Boolean} Boolean indicating if the current state matches the passed in state.
   */
  is(state) {
    return this.chainSyncStatus === state
  }

  /**
   * Set the current state and emit an event to notify others if te state as canged.
   * @param {String} state Target state.
   */
  setState(state) {
    if (state !== this.chainSyncStatus) {
      this.chainSyncStatus = state
      this.emit(state)
    }
  }

  /**
   * Set the current block height and emit an event to notify others if it has changed.
   * @param {String|Number} height Block height
   */
  setCurrentBlockHeight(height) {
    const heightAsNumber = Number(height)
    const changed = Bitcoind.incrementIfHigher(this, 'currentBlockHeight', heightAsNumber)
    if (changed) {
      this.emit(GOT_BITCOIND_CURRENT_BLOCK_HEIGHT, heightAsNumber)
    }
  }
}

export default Bitcoind

// @flow

import split2 from 'split2'
import { spawn } from 'child_process'
import EventEmitter from 'events'
import { mainLog, lndLog, lndLogGetLevel } from '../utils/log'
import { fetchBlockHeight } from './util'
import LndConfig from './config'

// Sync statuses
const CHAIN_SYNC_PENDING = 'chain-sync-pending'
const CHAIN_SYNC_WAITING = 'chain-sync-waiting'
const CHAIN_SYNC_IN_PROGRESS = 'chain-sync-started'
const CHAIN_SYNC_COMPLETE = 'chain-sync-finished'

// Events
const ERROR = 'error'
const CLOSE = 'close'
const WALLET_UNLOCKER_GRPC_ACTIVE = 'wallet-unlocker-grpc-active'
const LIGHTNING_GRPC_ACTIVE = 'lightning-grpc-active'
const GOT_CURRENT_BLOCK_HEIGHT = 'got-current-block-height'
const GOT_LND_BLOCK_HEIGHT = 'got-lnd-block-height'
const GOT_LND_CFILTER_HEIGHT = 'got-lnd-cfilter-height'

/**
 * Wrapper class for Lnd to run and monitor it in Neutrino mode.
 * @extends EventEmitter
 */
class Neutrino extends EventEmitter {
  lndConfig: LndConfig
  process: any
  walletUnlockerGrpcActive: boolean
  lightningGrpcActive: boolean
  chainSyncStatus: string
  currentBlockHeight: number
  lndBlockHeight: number
  lndCfilterHeight: number
  lastError: ?string

  constructor(lndConfig: LndConfig) {
    super()
    this.lndConfig = lndConfig
    this.process = null
    this.walletUnlockerGrpcActive = false
    this.lightningGrpcActive = false
    this.chainSyncStatus = CHAIN_SYNC_PENDING
    this.currentBlockHeight = 0
    this.lndBlockHeight = 0
    this.lndCfilterHeight = 0
    this.lastError = null
  }

  static incrementIfHigher = (context: any, property: string, newVal: any): boolean => {
    const { [property]: oldVal } = context
    if (newVal > oldVal) {
      context[property] = newVal
      return true
    }
    return false
  }

  /**
   * Start the Lnd process in Neutrino mode.
   * @return {Number} PID of the Lnd process that was started.
   */
  start() {
    if (this.process) {
      throw new Error('Neutrino process with PID ${this.process.pid} already exists.')
    }

    mainLog.info('Starting lnd in neutrino mode')
    mainLog.info(' > binaryPath', this.lndConfig.binaryPath)
    mainLog.info(' > rpcProtoPath:', this.lndConfig.rpcProtoPath)
    mainLog.info(' > host:', this.lndConfig.host)
    mainLog.info(' > cert:', this.lndConfig.cert)
    mainLog.info(' > macaroon:', this.lndConfig.macaroon)

    const neutrinoArgs = [
      `--configfile=${this.lndConfig.configPath}`,
      `--lnddir=${this.lndConfig.lndDir}`,
      `${this.lndConfig.autopilot ? '--autopilot.active' : ''}`,
      `${this.lndConfig.alias ? `--alias=${this.lndConfig.alias}` : ''}`
    ]

    if (this.lndConfig.network === 'mainnet') {
      neutrinoArgs.push('--neutrino.connect=mainnet1-btcd.zaphq.io')
      // neutrinoArgs.push('--neutrino.connect=mainnet2-btcd.zaphq.io')
    } else {
      neutrinoArgs.push('--neutrino.connect=testnet1-btcd.zaphq.io')
      // neutrinoArgs.push('--neutrino.connect=testnet2-btcd.zaphq.io')
    }

    this.process = spawn(this.lndConfig.binaryPath, neutrinoArgs)
      .on('error', error => this.emit(ERROR, error))
      .on('close', code => {
        this.emit(CLOSE, code, this.lastError)
        this.process = null
      })

    // Listen for when neutrino prints data to stderr.
    this.process.stderr.pipe(split2()).on('data', line => {
      if (process.env.NODE_ENV === 'development') {
        const level = lndLogGetLevel(line)
        lndLog[level](line)
        if (level === 'error') {
          this.lastError = line.split('[ERR] LTND:')[1]
        }
      }
    })

    // Listen for when neutrino prints data to stdout.
    this.process.stdout.pipe(split2()).on('data', line => {
      if (process.env.NODE_ENV === 'development') {
        const level = lndLogGetLevel(line)
        lndLog[level](line)
        if (level === 'error') {
          this.lastError = line.split('[ERR] LTND:')[1]
        }
      }

      // password RPC server listening (wallet unlocker started).
      if (!this.walletUnlockerGrpcActive && !this.lightningGrpcActive) {
        if (line.includes('RPC server listening on') && line.includes('password')) {
          this.walletUnlockerGrpcActive = true
          this.emit(WALLET_UNLOCKER_GRPC_ACTIVE)
        }
      }

      // RPC server listening (wallet unlocked).
      if (!this.lightningGrpcActive) {
        if (line.includes('RPC server listening on') && !line.includes('password')) {
          this.lightningGrpcActive = true
          this.emit(LIGHTNING_GRPC_ACTIVE)
        }
      }

      // If the sync has already completed then we don't need to do anything else.
      if (this.is(CHAIN_SYNC_COMPLETE)) {
        return
      }

      if (this.is(CHAIN_SYNC_PENDING) || this.is(CHAIN_SYNC_IN_PROGRESS)) {
        // If we cant get a connectionn to the backend.
        if (
          line.includes('Waiting for chain backend to finish sync') ||
          line.includes('Waiting for block headers to sync, then will start cfheaders sync')
        ) {
          this.setState(CHAIN_SYNC_WAITING)
        }
        // If we are still waiting for the back end to finish synncing.
        if (line.includes('No sync peer candidates available')) {
          this.setState(CHAIN_SYNC_WAITING)
        }
      }

      // Lnd syncing has started or resumed.
      if (this.is(CHAIN_SYNC_PENDING) || this.is(CHAIN_SYNC_WAITING)) {
        const match =
          line.match(/Syncing to block height (\d+)/) ||
          line.match(/Starting cfilters sync at block_height=(\d+)/)

        if (match) {
          // Notify that chhain syncronisation has now started.
          this.setState(CHAIN_SYNC_IN_PROGRESS)

          // This is the latest block that BTCd is aware of.
          const btcdHeight = match[1]
          this.setCurrentBlockHeight(btcdHeight)

          // The height returned from the LND log output may not be the actual current block height (this is the case
          // when BTCD is still in the middle of syncing the blockchain) so try to fetch thhe current height from from
          // some block explorers just incase.
          fetchBlockHeight()
            .then(height => (height > btcdHeight ? this.setCurrentBlockHeight(height) : null))
            // If we were unable to fetch from bock explorers at least we already have what BTCd gave us so just warn.
            .catch(err => mainLog.warn(`Unable to fetch block height: ${err.message}`))
        }
      }

      // Lnd as received some updated block data.
      if (this.is(CHAIN_SYNC_WAITING) || this.is(CHAIN_SYNC_IN_PROGRESS)) {
        let height
        let cfilter
        let match

        if ((match = line.match(/Caught up to height (\d+)/))) {
          height = match[1]
        } else if ((match = line.match(/Processed \d* blocks? in the last.+\(height (\d+)/))) {
          height = match[1]
        } else if ((match = line.match(/Difficulty retarget at block height (\d+)/))) {
          height = match[1]
        } else if ((match = line.match(/Fetching set of headers from tip \(height=(\d+)/))) {
          height = match[1]
        } else if ((match = line.match(/Waiting for filter headers \(height=(\d+)\) to catch/))) {
          height = match[1]
        } else if ((match = line.match(/Writing filter headers up to height=(\d+)/))) {
          height = match[1]
        } else if ((match = line.match(/Starting cfheaders sync at block_height=(\d+)/))) {
          height = match[1]
        } else if ((match = line.match(/Got cfheaders from height=(\d*) to height=(\d+)/))) {
          cfilter = match[2]
        } else if ((match = line.match(/Writing filter headers up to height=(\d*)/))) {
          cfilter = match[1]
        } else if ((match = line.match(/Verified \d* filter headers? in the.+\(height (\d+)/))) {
          cfilter = match[1]
        } else if ((match = line.match(/Fetching filter for height=(\d+)/))) {
          cfilter = match[1]
        }

        if (height) {
          this.setState(CHAIN_SYNC_IN_PROGRESS)
          this.setLndBlockHeight(height)
        }

        if (cfilter) {
          this.setState(CHAIN_SYNC_IN_PROGRESS)
          this.setLndCfilterHeight(cfilter)
        }

        // Lnd syncing has completed.
        if (line.includes('Chain backend is fully synced')) {
          this.setState(CHAIN_SYNC_COMPLETE)
        }
      }
    })

    return this.process
  }

  /**
   * Stop the Lnd process.
   */
  kill() {
    if (this.process) {
      mainLog.info('Killing Neutrino process...')
      this.process.kill()
      this.process = null
    }
  }

  /**
   * Check if the current state matches the passted in state.
   * @param  {String} state State to compare against the current state.
   * @return {Boolean} Boolean indicating if the current state matches the passed in state.
   */
  is(state: string) {
    return this.chainSyncStatus === state
  }

  /**
   * Set the current state and emit an event to notify others if te state as canged.
   * @param {String} state Target state.
   */
  setState(state: string) {
    if (state !== this.chainSyncStatus) {
      this.chainSyncStatus = state
      this.emit(state)
    }
  }

  /**
   * Set the current block height and emit an event to notify others if it has changed.
   * @param {String|Number} height Block height
   */
  setCurrentBlockHeight(height: number | string) {
    const heightAsNumber = Number(height)
    const changed = Neutrino.incrementIfHigher(this, 'currentBlockHeight', heightAsNumber)
    if (changed) {
      this.emit(GOT_CURRENT_BLOCK_HEIGHT, heightAsNumber)
    }
  }

  /**
   * Set the lnd block height and emit an event to notify others if it has changed.
   * @param {String|Number} height Block height
   */
  setLndBlockHeight(height: number | string) {
    const heightAsNumber = Number(height)
    const changed = Neutrino.incrementIfHigher(this, 'lndBlockHeight', heightAsNumber)
    if (changed) {
      this.emit(GOT_LND_BLOCK_HEIGHT, heightAsNumber)
      this.setCurrentBlockHeight(heightAsNumber)
    }
  }

  /**
   * Set the lnd cfilter height and emit an event to notify others if it has changed.
   * @param {String|Number} height Block height
   */
  setLndCfilterHeight(height: number | string) {
    const heightAsNumber = Number(height)
    const changed = Neutrino.incrementIfHigher(this, 'lndCfilterHeight', heightAsNumber)
    if (changed) {
      this.emit(GOT_LND_CFILTER_HEIGHT, heightAsNumber)
      this.setCurrentBlockHeight(heightAsNumber)
    }
  }
}

export default Neutrino

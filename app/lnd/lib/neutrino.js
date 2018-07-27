import split2 from 'split2'
import { spawn } from 'child_process'
import EventEmitter from 'events'
import config from '../config'
import { mainLog, lndLog, lndLogGetLevel } from '../../utils/log'
import { fetchBlockHeight } from './util'

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

/**
 * Wrapper class for Lnd to run and monitor it in Neutrino mode.
 * @extends EventEmitter
 */
class Neutrino extends EventEmitter {
  constructor(alias, autopilot) {
    super()
    this.alias = alias
    this.autopilot = autopilot
    this.process = null
    this.walletUnlockerGrpcActive = false
    this.lightningGrpcActive = false
    this.chainSyncStatus = CHAIN_SYNC_PENDING
  }

  /**
   * Start the Lnd process in Neutrino mode.
   * @return {Number} PID of the Lnd process that was started.
   */
  start() {
    if (this.process) {
      throw new Error('Neutrino process with PID ${this.process.pid} already exists.')
    }

    const lndConfig = config.lnd()
    mainLog.info('Starting lnd in neutrino mode')
    mainLog.debug(' > lndPath', lndConfig.lndPath)
    mainLog.debug(' > rpcProtoPath:', lndConfig.rpcProtoPath)
    mainLog.debug(' > host:', lndConfig.host)
    mainLog.debug(' > cert:', lndConfig.cert)
    mainLog.debug(' > macaroon:', lndConfig.macaroon)

    const neutrinoArgs = [
      `--configfile=${lndConfig.configPath}`,
      `${this.autopilot ? '--autopilot.active' : ''}`,
      `${this.alias ? `--alias=${this.alias}` : ''}`
    ]

    this.process = spawn(lndConfig.lndPath, neutrinoArgs)
      .on('error', error => this.emit(ERROR, error))
      .on('close', code => {
        this.emit(CLOSE, code)
        this.process = null
      })

    // Listen for when neutrino prints odata to stderr.
    this.process.stderr.pipe(split2()).on('data', line => {
      if (process.env.NODE_ENV === 'development') {
        lndLog[lndLogGetLevel(line)](line)
      }
    })

    // Listen for when neutrino prints data to stdout.
    this.process.stdout.pipe(split2()).on('data', line => {
      if (process.env.NODE_ENV === 'development') {
        lndLog[lndLogGetLevel(line)](line)
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

      // Lnd waiting for backend to finish syncing.
      if (this.is(CHAIN_SYNC_PENDING) || this.is(CHAIN_SYNC_IN_PROGRESS)) {
        if (
          line.includes('No sync peer candidates available') ||
          line.includes('Unable to synchronize wallet to chain') ||
          line.includes('Waiting for chain backend to finish sync')
        ) {
          this.setState(CHAIN_SYNC_WAITING)
        }
      }

      // Lnd syncing has started or resumed.
      if (this.is(CHAIN_SYNC_PENDING) || this.is(CHAIN_SYNC_WAITING)) {
        const match = line.match(/Syncing to block height (\d+)/)
        if (match) {
          // Notify that chhain syncronisation has now started.
          this.setState(CHAIN_SYNC_IN_PROGRESS)

          // This is the latest block that BTCd is aware of.
          const btcdHeight = Number(match[1])
          this.emit(GOT_CURRENT_BLOCK_HEIGHT, btcdHeight)

          // The height returned from the LND log output may not be the actual current block height (this is the case
          // when BTCD is still in the middle of syncing the blockchain) so try to fetch thhe current height from from
          // some block explorers just incase.
          fetchBlockHeight()
            .then(
              height => (height > btcdHeight ? this.emit(GOT_CURRENT_BLOCK_HEIGHT, height) : null)
            )
            // If we were unable to fetch from bock explorers at least we already have what BTCd gave us so just warn.
            .catch(err => mainLog.warn(`Unable to fetch block height: ${err.message}`))
        }
      }

      // Lnd as received some updated block data.
      if (this.is(CHAIN_SYNC_WAITING) || this.is(CHAIN_SYNC_IN_PROGRESS)) {
        let height
        let match

        if ((match = line.match(/Rescanned through block.+\(height (\d+)/))) {
          height = match[1]
        } else if ((match = line.match(/Caught up to height (\d+)/))) {
          height = match[1]
        } else if ((match = line.match(/Processed \d* blocks? in the last.+\(height (\d+)/))) {
          height = match[1]
        }

        if (height) {
          this.setState(CHAIN_SYNC_IN_PROGRESS)
          this.emit(GOT_LND_BLOCK_HEIGHT, height)
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
  stop() {
    if (this.process) {
      this.process.kill()
      this.process = null
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
}

export default Neutrino

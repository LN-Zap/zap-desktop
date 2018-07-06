import split2 from 'split2'
import { spawn } from 'child_process'
import EventEmitter from 'events'
import config from '../config'
import { mainLog, lndLog, lndLogGetLevel } from '../../utils/log'
import { fetchBlockHeight } from './util'

// Sync status is currenty pending.
const NEUTRINO_SYNC_STATUS_PENDING = 'chain-sync-pending'

// Waiting for chain backend to finish synchronizing.
const NEUTRINO_SYNC_STATUS_WAITING = 'chain-sync-waiting'

// Initial sync is currently in progress.
const NEUTRINO_SYNC_STATUS_IN_PROGRESS = 'chain-sync-started'

// Initial sync has completed.
const NEUTRINO_SYNC_STATUS_COMPLETE = 'chain-sync-finished'

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
    this.grpcProxyStarted = false
    this.walletOpened = false
    this.chainSyncStatus = NEUTRINO_SYNC_STATUS_PENDING
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
      .on('error', error => this.emit('error', error))
      .on('close', code => {
        this.emit('close', code)
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

      // gRPC started.
      if (!this.grpcProxyStarted) {
        if (line.includes('gRPC proxy started') && line.includes('password')) {
          this.grpcProxyStarted = true
          this.emit('grpc-proxy-started')
        }
      }

      // Wallet opened.
      if (!this.walletOpened) {
        if (line.includes('gRPC proxy started') && !line.includes('password')) {
          this.walletOpened = true
          this.emit('wallet-opened')
        }
      }

      // If the sync has already completed then we don't need to do anythibng else.
      if (this.is(NEUTRINO_SYNC_STATUS_COMPLETE)) {
        return
      }

      // Lnd waiting for backend to finish syncing.
      if (this.is(NEUTRINO_SYNC_STATUS_PENDING) || this.is(NEUTRINO_SYNC_STATUS_IN_PROGRESS)) {
        if (
          line.includes('No sync peer candidates available') ||
          line.includes('Unable to synchronize wallet to chain') ||
          line.includes('Waiting for chain backend to finish sync')
        ) {
          this.setState(NEUTRINO_SYNC_STATUS_WAITING)
        }
      }

      // Lnd syncing has started or resumed.
      if (this.is(NEUTRINO_SYNC_STATUS_PENDING) || this.is(NEUTRINO_SYNC_STATUS_WAITING)) {
        const match = line.match(/Syncing to block height (\d+)/)
        if (match) {
          // Notify that chhain syncronisation has now started.
          this.setState(NEUTRINO_SYNC_STATUS_IN_PROGRESS)

          // This is the latest block that BTCd is aware of.
          const btcdHeight = Number(match[1])
          this.emit('got-current-block-height', btcdHeight)

          // The height returned from the LND log output may not be the actual current block height (this is the case
          // when BTCD is still in the middle of syncing the blockchain) so try to fetch thhe current height from from
          // some block explorers just incase.
          fetchBlockHeight()
            .then(
              height => (height > btcdHeight ? this.emit('got-current-block-height', height) : null)
            )
            // If we were unable to fetch from bock explorers at least we already have what BTCd gave us so just warn.
            .catch(err => mainLog.warn(`Unable to fetch block height: ${err.message}`))
        }
      }

      // Lnd as received some updated block data.
      if (this.is(NEUTRINO_SYNC_STATUS_WAITING) || this.is(NEUTRINO_SYNC_STATUS_IN_PROGRESS)) {
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
          this.setState(NEUTRINO_SYNC_STATUS_IN_PROGRESS)
          this.emit('got-lnd-block-height', height)
        }

        // Lnd syncing has completed.
        if (line.includes('Chain backend is fully synced')) {
          this.setState(NEUTRINO_SYNC_STATUS_COMPLETE)
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

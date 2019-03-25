// @flow

import split2 from 'split2'
import { spawn } from 'child_process'
import EventEmitter from 'events'
import { mainLog, lndLog, lndLogGetLevel } from '@zap/utils/log'
import { fetchBlockHeight } from './util'
import LndConfig from './config'

// When we run in production mode, this file is processd with webpack and our config is made available in the
// global CONFIG object. If this is not set then we must be running in development mode (where this file is loaded
// directly without processing with webpack), so we require the config module directly in this case.
try {
  declare var CONFIG: Object
  global.CONFIG = CONFIG
} catch (e) {
  global.CONFIG = require('config')
}

// Sync statuses
const CHAIN_SYNC_PENDING = 'chain-sync-pending'
const CHAIN_SYNC_WAITING = 'chain-sync-waiting'
const CHAIN_SYNC_IN_PROGRESS = 'chain-sync-started'
const CHAIN_SYNC_COMPLETE = 'chain-sync-finished'

// Events
const ERROR = 'error'
const EXIT = 'exit'
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
  isWalletUnlockerGrpcActive: boolean
  isLightningGrpcActive: boolean
  chainSyncStatus: string
  currentBlockHeight: number
  lndBlockHeight: number
  lndCfilterHeight: number
  lastError: ?string

  constructor(lndConfig: LndConfig) {
    super()
    this.lndConfig = lndConfig
    this.process = null
    this.isWalletUnlockerGrpcActive = false
    this.isLightningGrpcActive = false
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
  async start() {
    if (this.process) {
      return Promise.reject(
        new Error(`Neutrino process with PID ${this.process.pid} already exists.`)
      )
    }

    // The height returned from the LND log output may not be the actual current block height (this is the case
    // when BTCD is still in the middle of syncing the blockchain) so try to fetch thhe current height from from
    // some block explorers so that we have a good starting point.
    try {
      const blockHeight = await fetchBlockHeight(this.lndConfig.chain, this.lndConfig.network)
      this.setCurrentBlockHeight(blockHeight)
    } catch (err) {
      mainLog.warn(`Unable to fetch block height: ${err.message}`)
    }

    const listen = await LndConfig.getListen('p2p')
    const restlisten = await LndConfig.getListen('rest')

    mainLog.info('Starting lnd in neutrino mode')
    mainLog.info(' > binaryPath', this.lndConfig.binaryPath)
    mainLog.info(' > chain', this.lndConfig.chain)
    mainLog.info(' > network', this.lndConfig.network)
    mainLog.info(' > host:', this.lndConfig.host)
    mainLog.info(' > cert:', this.lndConfig.cert)
    mainLog.info(' > macaroon:', this.lndConfig.macaroon)

    // Genreate autopilot config.
    const autopilotArgMap: Object = {
      autopilotAllocation: '--autopilot.allocation',
      autopilotMaxchannels: '--autopilot.maxchannels',
      autopilotMinchansize: '--autopilot.minchansize',
      autopilotMaxchansize: '--autopilot.maxchansize',
      autopilotMinconfs: '--autopilot.minconfs',
    }
    const autopilotConf = []
    Object.entries(this.lndConfig).forEach(([key, value]) => {
      if (Object.keys(autopilotArgMap).includes(key)) {
        autopilotConf.push(`${autopilotArgMap[key]}=${String(value)}`)
      }
    })

    // Configure lnd.
    const neutrinoArgs = [
      `--${this.lndConfig.chain}.active`,
      `--lnddir=${this.lndConfig.lndDir}`,
      `--rpclisten=${this.lndConfig.host}`,
      `--listen=${listen}`,
      `--restlisten=${restlisten}`,
      `--routing.assumechanvalid`,
      `${this.lndConfig.alias ? `--alias=${this.lndConfig.alias}` : ''}`,
      `${this.lndConfig.autopilot ? '--autopilot.active' : ''}`,
      `${this.lndConfig.autopilotPrivate ? '--autopilot.private' : ''}`,
      ...autopilotConf,
    ]

    // Configure neutrino backend.
    neutrinoArgs.push('--bitcoin.node=neutrino')
    neutrinoArgs.push(`--${this.lndConfig.chain}.${this.lndConfig.network}`)
    global.CONFIG.lnd.neutrino[this.lndConfig.chain][this.lndConfig.network].forEach(node =>
      neutrinoArgs.push(`--neutrino.connect=${node}`)
    )

    // Log the final config.
    mainLog.info(
      'Spawning Neutrino process: %s %s',
      this.lndConfig.binaryPath,
      neutrinoArgs.filter(v => v != '').join(' ')
    )

    // Spawn lnd process.
    this.process = spawn(this.lndConfig.binaryPath, neutrinoArgs)
      .on('error', error => {
        mainLog.debug('Neutrino process received "error" event with error: %s', error)
        this.emit(ERROR, error, this.lastError)
      })
      .on('exit', (code, signal) => {
        mainLog.debug(
          'Neutrino process received "exit" event with code %s and signal %s',
          code,
          signal
        )
        this.emit(EXIT, code, signal, this.lastError)
        this.process = null
      })

    // Listen for when neutrino prints data to stderr.
    this.process.stderr.pipe(split2()).on('data', line => {
      lndLog.error(line)
      if (line.startsWith('panic:')) {
        this.lastError = line
      }
    })

    // Listen for when neutrino prints data to stdout.
    this.process.stdout.pipe(split2()).on('data', line => {
      const level = lndLogGetLevel(line)
      lndLog[level](line)
      if (level === 'error') {
        this.lastError = line.split('[ERR] LTND:')[1]
      }

      // password RPC server listening (wallet unlocker started).
      if (!this.isWalletUnlockerGrpcActive && !this.isLightningGrpcActive) {
        if (line.includes('RPC server listening on') && line.includes('password')) {
          this.isWalletUnlockerGrpcActive = true
          this.emit(WALLET_UNLOCKER_GRPC_ACTIVE)
        }
      }

      // RPC server listening (wallet unlocked).
      if (!this.isLightningGrpcActive) {
        if (line.includes('RPC server listening on') && !line.includes('password')) {
          this.isLightningGrpcActive = true
          this.emit(LIGHTNING_GRPC_ACTIVE)
        }
      }

      // If the sync has already completed then we don't need to do anything else.
      if (this.is(CHAIN_SYNC_COMPLETE)) {
        return
      }

      if (this.is(CHAIN_SYNC_PENDING) || this.is(CHAIN_SYNC_IN_PROGRESS)) {
        // If we can't get a connectionn to the backend.
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
  kill(signalName: string = 'SIGINT') {
    if (this.process) {
      mainLog.info('Killing Neutrino process...')
      this.process.kill(signalName)
    }
  }

  /**
   * Check if the current state matches the pasted in state.
   * @param  {String} state State to compare against the current state.
   * @return {Boolean} Boolean indicating if the current state matches the passed in state.
   */
  is(state: string) {
    return this.chainSyncStatus === state
  }

  /**
   * Set the current state and emit an event to notify others if the state as changed.
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

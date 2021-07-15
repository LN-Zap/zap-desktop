/* eslint-disable class-methods-use-this */
import { spawn } from 'child_process'
import EventEmitter from 'events'

import config from 'config'
import split2 from 'split2'

import delay from '@zap/utils/delay'
import fetchBlockHeight from '@zap/utils/fetchBlockHeight'
import getLndListen from '@zap/utils/getLndListen'
import getPackageDetails from '@zap/utils/getPackageDetails'
import { mainLog, lndLog, lndLogGetLevel } from '@zap/utils/log'

// Sync statuses.
export const NEUTRINO_CHAIN_SYNC_PENDING = 'NEUTRINO_CHAIN_SYNC_PENDING'
export const NEUTRINO_CHAIN_SYNC_WAITING = 'NEUTRINO_CHAIN_SYNC_WAITING'
export const NEUTRINO_CHAIN_SYNC_IN_PROGRESS = 'NEUTRINO_CHAIN_SYNC_IN_PROGRESS'
export const NEUTRINO_CHAIN_SYNC_COMPLETE = 'NEUTRINO_CHAIN_SYNC_COMPLETE'
export const NEUTRINO_WALLET_RECOVERY_IN_PROGRESS = 'NEUTRINO_WALLET_RECOVERY_IN_PROGRESS'

// Events.
export const NEUTRINO_SHUTDOWN = 'NEUTRINO_SHUTDOWN'
export const NEUTRINO_ERROR = 'NEUTRINO_ERROR'
export const NEUTRINO_EXIT = 'NEUTRINO_EXIT'
export const NEUTRINO_WALLET_UNLOCKER_GRPC_ACTIVE = 'NEUTRINO_WALLET_UNLOCKER_GRPC_ACTIVE'
export const NEUTRINO_LIGHTNING_GRPC_ACTIVE = 'NEUTRINO_LIGHTNING_GRPC_ACTIVE'
export const NEUTRINO_GOT_CURRENT_BLOCK_HEIGHT = 'NEUTRINO_GOT_CURRENT_BLOCK_HEIGHT'
export const NEUTRINO_GOT_LND_BLOCK_HEIGHT = 'NEUTRINO_GOT_LND_BLOCK_HEIGHT'
export const NEUTRINO_GOT_LND_CFILTER_HEIGHT = 'NEUTRINO_GOT_LND_CFILTER_HEIGHT'
export const NEUTRINO_GOT_WALLET_RECOVERY_HEIGHT = 'NEUTRINO_GOT_WALLET_RECOVERY_HEIGHT'

// Constants.
export const NEUTRINO_SHUTDOWN_TIMEOUT = 10000

class Neutrino extends EventEmitter {
  constructor() {
    super()
    this.resetState()
  }

  static incrementIfHigher = (context, property, newVal) => {
    if (Number.isNaN(newVal)) {
      return false
    }
    const { [property]: oldVal } = context
    if (newVal > oldVal) {
      context[property] = newVal
      return true
    }
    return false
  }

  /**
   * resetState - Initialise state data.
   */
  resetState() {
    this.process = null
    this.isWalletUnlockerGrpcActive = false
    this.isLightningGrpcActive = false
    this.chainSyncStatus = NEUTRINO_CHAIN_SYNC_PENDING
    this.currentBlockHeight = 0
    this.neutrinoBlockHeight = 0
    this.neutrinoCfilterHeight = 0
    this.neutrinoRecoveryHeight = 0
    this.lastError = null
  }

  /**
   * init - Initialize the service.
   *
   * @param {object} lndConfig LndConfig
   */
  init(lndConfig) {
    mainLog.info(`Initializing Neutrino with options: %o`, lndConfig)
    this.lndConfig = lndConfig
  }

  /**
   * start - Start the Lnd process in Neutrino mode.
   *
   * @returns {Promise<number>} PID of the Lnd process that was started.
   */
  async start() {
    if (this.getPid()) {
      return Promise.reject(new Error(`Neutrino process with PID ${this.getPid()} already exists.`))
    }

    mainLog.info('Starting lnd in neutrino mode with config: %o', this.lndConfig)
    mainLog.info(' > binaryPath', this.lndConfig.binaryPath)
    mainLog.info(' > chain', this.lndConfig.chain)
    mainLog.info(' > network', this.lndConfig.network)
    mainLog.info(' > host:', this.lndConfig.host)
    mainLog.info(' > cert:', this.lndConfig.cert)
    mainLog.info(' > macaroon:', this.lndConfig.macaroon)

    // The height returned from the LND log output may not be the actual current block height (this is the case
    // when BTCD is still in the middle of syncing the blockchain) so try to fetch the current height from from
    // some block explorers so that we have a good starting point.
    fetchBlockHeight(this.lndConfig.chain, this.lndConfig.network)
      .then(blockHeight => this.setCurrentBlockHeight(blockHeight))
      .catch(err => mainLog.warn(`Unable to fetch block height: ${err.message}`))

    const lndArgs = await this.getLndArgs()

    // Log the final config.
    mainLog.info(
      'Spawning Neutrino process: %s %s',
      this.lndConfig.binaryPath,
      lndArgs.filter(v => v !== '').join(' ')
    )

    // Spawn neutrino process.
    this.process = spawn(this.lndConfig.binaryPath, lndArgs)

    // Attach event handlers and output stream processors.
    this.attachEventHandlers(this.process)
    this.attachStderrProcessors(this.process.stderr)
    this.attachStdoutProcessors(this.process.stdout)

    // Return the pid.
    return this.process.pid
  }

  /**
   * shutdown - Shutdown neutrino process.
   *
   * @param {object}  [options={}] Shutdown options.
   * @returns {Promise} Promise
   */
  async shutdown(options = {}) {
    const signal = options.signal || 'SIGINT'
    const timeout = options.timeout || NEUTRINO_SHUTDOWN_TIMEOUT

    mainLog.info('Shutting down Neutrino...')
    this.emit(NEUTRINO_SHUTDOWN)

    if (!this.getPid()) {
      mainLog.info('No Neutrino process found.')
      return
    }

    await this.shutdownNeutrino(signal, timeout)
    mainLog.info('Neutrino shutdown complete.')
  }

  /**
   * shutdownNeutrino - Attempt to gracefully terminate the neutrino process. If it fails, force kill it.
   *
   * @param {string}  signal  process signal
   * @param {number}  timeout timeout before force killing with SIGKILL
   * @returns {Promise} Promise
   */
  async shutdownNeutrino(signal, timeout) {
    let hasCompleted = false

    // promisify NEUTRINO_EXIT callback.
    const neutrinoExitComplete = new Promise(resolve => {
      this.once(NEUTRINO_EXIT, () => {
        hasCompleted = true
        resolve()
      })
    })

    // Force kill process if it has not already exited after `timeout` ms.
    const forceShutdown = async () => {
      await delay(timeout)
      // If graceful shutdown has not completed, we need to force shutdown.
      if (!hasCompleted) {
        mainLog.warn('Graceful shutdown failed to complete within 10 seconds. Killing Neutrino.')
        this.kill('SIGKILL')
      }
      return neutrinoExitComplete
    }

    // Kill the Neutrino process (sends `signal` to Neutrino process).
    this.kill(signal)
    return Promise.race([neutrinoExitComplete, forceShutdown()])
  }

  /**
   * getPid - Get the pid of the currently running neutrino process.
   *
   * @returns {number|null} PID of currently running neutrino process.
   */
  getPid() {
    return this.process ? this.process.pid : null
  }

  /**
   * signalName - Stop the Lnd process.
   *
   * @param {string} [signalName='SIGINT'] signal to kill lnd with.
   */
  kill(signalName = 'SIGINT') {
    if (this.process) {
      mainLog.info('Killing Neutrino process...')
      this.process.kill(signalName)
    }
  }

  /**
   * is - Check if the current state matches the pasted in state.
   *
   * @param {string} state State to compare against the current state.
   * @returns {boolean} Boolean indicating if the current state matches the passed in state.
   */
  is(state) {
    return this.chainSyncStatus === state
  }

  /**
   * setState - Set the current state and emit an event to notify others if the state as changed.
   *
   * @param {string} state Target state.
   */
  setState(state) {
    if (state !== this.chainSyncStatus) {
      mainLog.info('Set neutrino state', state)
      this.chainSyncStatus = state
      this.emit(state)
    }
  }

  /**
   * setCurrentBlockHeight - Set the current block height and emit an event to notify others if it has changed.
   *
   * @param {string|number} height Block height
   */
  setCurrentBlockHeight(height) {
    const heightAsNumber = Number(height)
    const changed = Neutrino.incrementIfHigher(this, 'currentBlockHeight', heightAsNumber)
    if (changed) {
      mainLog.info('Set current block height', heightAsNumber)
      this.emit(NEUTRINO_GOT_CURRENT_BLOCK_HEIGHT, heightAsNumber)
    }
  }

  /**
   * setNeutrinoBlockHeight - Set the lnd block height and emit an event to notify others if it has changed.
   *
   * @param {string|number} height Block height
   */
  setNeutrinoBlockHeight(height) {
    const heightAsNumber = Number(height)
    const changed = Neutrino.incrementIfHigher(this, 'neutrinoBlockHeight', heightAsNumber)
    if (changed) {
      mainLog.info('Set neutrino block height', heightAsNumber)
      this.emit(NEUTRINO_GOT_LND_BLOCK_HEIGHT, heightAsNumber)
      this.setCurrentBlockHeight(heightAsNumber)
    }
  }

  /**
   * setNeutrinoCfilterHeight - Set the lnd cfilter height and emit an event to notify others if it has changed.
   *
   * @param {string|number} height Block height
   */
  setNeutrinoCfilterHeight(height) {
    const heightAsNumber = Number(height)
    const changed = Neutrino.incrementIfHigher(this, 'neutrinoCfilterHeight', heightAsNumber)
    if (changed) {
      mainLog.info('Set neutrino cfilter height', heightAsNumber)
      this.emit(NEUTRINO_GOT_LND_CFILTER_HEIGHT, heightAsNumber)
      this.setCurrentBlockHeight(heightAsNumber)
    }
  }

  /**
   * setNeutrinoRecoveryHeight - Set the current wallet recovery height and emit an event if it has changed.
   *
   * @param {string|number} height Block height
   */
  setNeutrinoRecoveryHeight(height) {
    const heightAsNumber = Number(height)
    const changed = Neutrino.incrementIfHigher(this, 'neutrinoRecoveryHeight', heightAsNumber)
    if (changed) {
      mainLog.info('Set neutrino recovery height', heightAsNumber)
      this.emit(NEUTRINO_GOT_WALLET_RECOVERY_HEIGHT, heightAsNumber)
    }
  }

  /**
   * getLndArgs - Get arguments to pass to lnd based on lnd config.
   *
   * @returns {Promise<Array>} Array of arguments
   */
  async getLndArgs() {
    // Get available ports.
    const [listen, restlisten] = await Promise.all([getLndListen('p2p'), getLndListen('rest')])

    // Get autopilot config.
    const autopilotArgs = this.getAutopilotArgs()

    // Get neutrino config.
    const neutrinoArgs = this.getNeutrinoArgs()

    // Configure lnd.
    const lndArgs = [
      '--debuglevel=debug',
      `--${this.lndConfig.chain}.active`,
      `--lnddir=${this.lndConfig.lndDir}`,
      `--rpclisten=${this.lndConfig.host}`,
      `--listen=${listen}`,
      `--restlisten=${restlisten}`,
      '--accept-keysend',
      '--protocol.wumbo-channels',
      `${this.lndConfig.assumechanvalid ? '--routing.assumechanvalid' : ''}`,
      `${this.lndConfig.alias ? `--alias=${this.lndConfig.alias}` : ''}`,
      ...autopilotArgs,
      ...neutrinoArgs,
    ]

    return lndArgs
  }

  /**
   * getAutopilotArgs - Get autopilot arguments to pass to lnd based on lnd config.
   *
   * @returns {Array} Array of arguments
   */
  getAutopilotArgs() {
    const autopilotArgs = []
    if (!this.lndConfig.autopilot) {
      return autopilotArgs
    }

    // Generate autopilot config from lnd config.
    const autopilotArgMap = {
      autopilot: `--autopilot.active`,
      autopilotPrivate: `--autopilot.private`,
      autopilotAllocation: '--autopilot.allocation',
      autopilotMaxchannels: '--autopilot.maxchannels',
      autopilotMinchansize: '--autopilot.minchansize',
      autopilotMaxchansize: '--autopilot.maxchansize',
      autopilotMinconfs: '--autopilot.minconfs',
    }

    Object.entries(this.lndConfig).forEach(([key, value]) => {
      if (Object.keys(autopilotArgMap).includes(key)) {
        const autopilotArgName = autopilotArgMap[key]
        switch (value) {
          // If the value is true handle as a simple boolean flag.
          case true:
            autopilotArgs.push(autopilotArgName)
            break

          // If the value is false exclude from the config.
          case false:
            break

          // Otherwise apply the config value.
          default:
            autopilotArgs.push(`${autopilotArgName}=${String(value)}`)
            break
        }
      }
    })

    // Add custom heuristics config.
    Object.entries(config.lnd.autopilot.heuristics).forEach(([key, value]) => {
      autopilotArgs.push(`--autopilot.heuristic=${key}:${value}`)
    })

    return autopilotArgs
  }

  /**
   * getNeutrinoArgs - Get neutrino arguments to pass to lnd based on lnd config.
   *
   * @returns {Array} Array of arguments
   */
  getNeutrinoArgs() {
    const neutrinoArgs = []
    const { chain, network, whitelistPeers, neutrinoNodes } = this.lndConfig
    const nodes = neutrinoNodes || config.lnd.neutrino[chain][network]
    const connectFlag = whitelistPeers ? 'connect' : 'addpeer'
    const feeUrl = 'https://nodes.lightning.computer/fees/v1/btc-fee-estimates.json'

    neutrinoArgs.push('--bitcoin.node=neutrino')
    neutrinoArgs.push('--neutrino.useragentname=zap-desktop')
    neutrinoArgs.push(`--neutrino.useragentversion=${getPackageDetails().version}`)
    neutrinoArgs.push(`--neutrino.feeurl=${feeUrl}`)
    neutrinoArgs.push(`--${chain}.${network}`)
    nodes.forEach(node => neutrinoArgs.push(`--neutrino.${connectFlag}=${node}`))

    return neutrinoArgs
  }

  /**
   * attachEventHandlers - Attach exit and error handlers to neutrino process.
   *
   * @param {object} process neutrino process.
   */
  attachEventHandlers(process) {
    // Attach error handler.
    process.on('error', error => {
      mainLog.error('Neutrino process received "error" event with error: %s', error)
      this.emit(NEUTRINO_ERROR, { error, lastError: this.lastError })
    })

    // Attach exit handler.
    process.on('exit', (code, signal) => {
      mainLog.info(
        'Neutrino process received "exit" event with code %s and signal %s',
        code,
        signal
      )
      this.emit(NEUTRINO_EXIT, { code, signal, lastError: this.lastError })
      this.resetState()
    })
  }

  /**
   * attachStderrProcessors - Listen for and process neutrino stderr data.
   *
   * @param {string} stderr log output line
   */
  attachStderrProcessors(stderr) {
    stderr.pipe(split2()).on('data', line => {
      lndLog.error(line)
      if (line.startsWith('panic:')) {
        this.lastError = line
      }
    })
  }

  /**
   * attachStdoutProcessors - Listen for and process neutrino stdout data.
   *
   * @param {string} stdout log output line
   */
  attachStdoutProcessors(stdout) {
    stdout.pipe(split2()).on('data', line => {
      this.handleErrors(line)
      this.notifyOnWalletUnlockerActivation(line)
      this.notifyLightningActivation(line)

      // If the sync has already completed then we don't need to do any more log processing.
      if (this.is(NEUTRINO_CHAIN_SYNC_COMPLETE)) {
        return
      }
      this.notifyOnSyncComplete(line)

      // Listen for things that will move us to waiting state.
      if (this.is(NEUTRINO_CHAIN_SYNC_PENDING) || this.is(NEUTRINO_CHAIN_SYNC_IN_PROGRESS)) {
        this.notifyOnSyncWaiting(line)
      }

      // Listen for things that will take us out of the waiting state.
      if (this.is(NEUTRINO_CHAIN_SYNC_PENDING) || this.is(NEUTRINO_CHAIN_SYNC_WAITING)) {
        this.notifyOnSyncStarted(line)
      }

      // Listen for things that will move us into the recovery state.
      if (this.is(NEUTRINO_CHAIN_SYNC_IN_PROGRESS)) {
        this.notifyOnRecoveryStarted(line)
      }

      // Listen for things that indicate sync progress.
      if (this.is(NEUTRINO_CHAIN_SYNC_WAITING) || this.is(NEUTRINO_CHAIN_SYNC_IN_PROGRESS)) {
        this.notifyOnSyncProgress(line)
      }

      // Listen for things that indicate recovery progress.
      if (this.is(NEUTRINO_WALLET_RECOVERY_IN_PROGRESS)) {
        this.notifyOnRecoveryProgress(line)
      }
    })
  }

  /**
   * handleErrors - Listen for when neutrino prints an error message.
   *
   * @param {string} line log output line
   */
  handleErrors(line) {
    const level = lndLogGetLevel(line)
    lndLog[level](line)
    if (level === 'error') {
      this.lastError = line.split('[ERR] LTND:')[1]
    }
  }

  /**
   *
   * notifyOnWalletUnlockerActivation - Update state if log line indicates WalletUnlocker gRPC became active.
   *
   * @param {string} line log output line
   */
  notifyOnWalletUnlockerActivation(line) {
    if (line.includes('RPC server listening on') && line.toLowerCase().includes('password')) {
      this.isWalletUnlockerGrpcActive = true
      this.isLightningGrpcActive = false
      this.emit(NEUTRINO_WALLET_UNLOCKER_GRPC_ACTIVE)
    }
  }

  /**
   * notifyLightningActivation - Update state if log line indicates Lightning gRPC became active.
   *
   * @param {string} line log output line
   */
  notifyLightningActivation(line) {
    if (line.includes('RPC server listening on') && !line.toLowerCase().includes('password')) {
      this.isLightningGrpcActive = true
      this.isWalletUnlockerGrpcActive = false
      this.emit(NEUTRINO_LIGHTNING_GRPC_ACTIVE)
    }
  }

  /**
   * notifyOnSyncWaiting - Update state if log line indicates we are waiting to sync.
   *
   * @param {string} line log output line
   */
  notifyOnSyncWaiting(line) {
    // If we can't get a connection to the backend.
    if (line.includes('No sync peer candidates available')) {
      this.setState(NEUTRINO_CHAIN_SYNC_WAITING)
    }
  }

  /**
   * notifyOnSyncStarted - Update state if log line indicates sync has started.
   *
   * @param {string} line log output line
   */
  notifyOnSyncStarted(line) {
    const match =
      line.match(/Syncing to block height (\d+)/) ||
      line.match(/Starting cfilters sync at block_height=(\d+)/) ||
      line.match(/Starting cfheaders sync from \(block_height=(\d+)/) ||
      line.includes('Waiting for chain backend to finish sync') ||
      line.includes('Waiting for block headers to sync, then will start cfheaders sync') ||
      line.includes('Starting rescan from known block')
    if (match) {
      this.setState(NEUTRINO_CHAIN_SYNC_IN_PROGRESS)

      // This is the latest block that BTCd is aware of.
      const btcdHeight = match[1]
      if (btcdHeight) {
        this.setCurrentBlockHeight(btcdHeight)
      }
    }
  }

  /**
   * notifyOnRecoveryStarted - Update state if log line indicates wallet recovery has started.
   *
   * @param {string} line log output line
   */
  notifyOnRecoveryStarted(line) {
    if (line.includes('RECOVERY MODE ENABLED')) {
      this.setState(NEUTRINO_WALLET_RECOVERY_IN_PROGRESS)
    }
  }

  /**
   * notifyOnSyncComplete - Update state if log line indicates that sync process has completed.
   *
   * @param {string} line log output line
   */
  notifyOnSyncComplete(line) {
    if (line.includes('Chain backend is fully synced')) {
      this.setState(NEUTRINO_CHAIN_SYNC_COMPLETE)
    }
  }

  /**
   * notifyOnSyncProgress - Update state if log line indicates that progress has been made in the sync process.
   *
   * @param {string} line log output line
   */
  notifyOnSyncProgress(line) {
    let cfilter

    // Check the log line to see if we can parse the current block header height from it.
    const height = this.getBlockHeaderIncrement(line)
    if (height) {
      this.setNeutrinoBlockHeight(height)
    }
    // Otherwise, see if we can parse the current cfilter height from it.
    else {
      cfilter = this.getCfilterIncrement(line) || this.getRecoveryHeightIncrement(line)
      if (cfilter) {
        this.setNeutrinoCfilterHeight(cfilter)
      }
    }
  }

  /**
   * notifyOnRecoveryProgress - Update state if log line indicates that progress has been made in the recovery process.
   *
   * @param {string} line log output line
   */
  notifyOnRecoveryProgress(line) {
    // Check the log line to see if we can parse the current block header height from it.
    const height = this.getRecoveryHeightIncrement(line)
    if (height) {
      this.setNeutrinoRecoveryHeight(height)
    }
  }

  /**
   * getBlockHeaderIncrement - Try to determine current block header height from log line.
   *
   * @param {string}   line log output line
   * @returns {string}      Current block header height, if found
   */
  getBlockHeaderIncrement(line) {
    let match
    let height

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
    }

    return height
  }

  /**
   * getCfilterIncrement - Try to determine current cfilter height from log line.
   *
   * @param {string}   line log output line
   * @returns {string}      Current cfilter height, if found
   */
  getCfilterIncrement(line) {
    let match
    let cfilter

    if ((match = line.match(/Starting cfheaders sync from \(block_height=(\d+)/))) {
      cfilter = match[1]
    } else if ((match = line.match(/Got cfheaders from height=(\d*) to height=(\d+)/))) {
      cfilter = match[2]
    } else if ((match = line.match(/Writing filter headers up to height=(\d*)/))) {
      cfilter = match[1]
    } else if ((match = line.match(/Verified \d* filter headers? in the.+\(height (\d+)/))) {
      cfilter = match[1]
    } else if ((match = line.match(/Fetching filter for height=(\d+)/))) {
      cfilter = match[1]
    }

    return cfilter
  }

  /**
   * getRecoveryHeightIncrement - Try to determine current recovery height from log line.
   *
   * @param {string}   line log output line
   * @returns {string}      Current recovery height, if found
   */
  getRecoveryHeightIncrement(line) {
    let match
    let cfilter

    if ((match = line.match(/Fetching filters for heights=\[(\d*), (\d*)\]/))) {
      cfilter = match[1]
    }

    return cfilter
  }
}

export default Neutrino

import split2 from 'split2'
import EventEmitter from 'events'
import { spawn } from 'child_process'
import config from 'config'
import delay from '@zap/utils/delay'
import { mainLog, lndLog, lndLogGetLevel } from '@zap/utils/log'
import getLndListen from '@zap/utils/getLndListen'
import fetchBlockHeight from '@zap/utils/fetchBlockHeight'

// Sync statuses
export const NEUTRINO_CHAIN_SYNC_PENDING = 'NEUTRINO_CHAIN_SYNC_PENDING'
export const NEUTRINO_CHAIN_SYNC_WAITING = 'NEUTRINO_CHAIN_SYNC_WAITING'
export const NEUTRINO_CHAIN_SYNC_IN_PROGRESS = 'NEUTRINO_CHAIN_SYNC_IN_PROGRESS'
export const NEUTRINO_CHAIN_SYNC_COMPLETE = 'NEUTRINO_CHAIN_SYNC_COMPLETE'

// Events
export const NEUTRINO_ERROR = 'NEUTRINO_ERROR'
export const NEUTRINO_EXIT = 'NEUTRINO_EXIT'
export const NEUTRINO_WALLET_UNLOCKER_GRPC_ACTIVE = 'NEUTRINO_WALLET_UNLOCKER_GRPC_ACTIVE'
export const NEUTRINO_LIGHTNING_GRPC_ACTIVE = 'NEUTRINO_LIGHTNING_GRPC_ACTIVE'
export const NEUTRINO_GOT_CURRENT_BLOCK_HEIGHT = 'NEUTRINO_GOT_CURRENT_BLOCK_HEIGHT'
export const NEUTRINO_GOT_LND_BLOCK_HEIGHT = 'NEUTRINO_GOT_LND_BLOCK_HEIGHT'
export const NEUTRINO_GOT_LND_CFILTER_HEIGHT = 'NEUTRINO_GOT_LND_CFILTER_HEIGHT'

// Constants
export const NEUTRINO_SHUTDOWN_TIMEOUT = 10000

/**
 * Wrapper class for Lnd to run and monitor it in Neutrino mode.
 * @extends EventEmitter
 */
class Neutrino extends EventEmitter {
  constructor() {
    super()
    this.resetState()
  }

  resetState() {
    this.process = null
    this.isWalletUnlockerGrpcActive = false
    this.isLightningGrpcActive = false
    this.chainSyncStatus = NEUTRINO_CHAIN_SYNC_PENDING
    this.currentBlockHeight = 0
    this.neutrinoBlockHeight = 0
    this.neutrinoCfilterHeight = 0
    this.lastError = null
  }

  /**
   * Initialize the service.
   *
   * Note: comline doesn't seem to properly support passing args via the constructor
   *       which is why we do it here.
   * @param  {[type]}  options [description]
   * @return {Promise}         [description]
   */
  async init(lndConfig) {
    // Initialise the lnd config
    mainLog.info(`Initializing Neutrino with options: %o`, lndConfig)
    this.lndConfig = lndConfig
  }

  static incrementIfHigher = (context, property, newVal) => {
    const { [property]: oldVal } = context
    if (newVal > oldVal) {
      context[property] = newVal
      return true
    }
    return false
  }

  getPid() {
    return this.process ? this.process.pid : null
  }

  /**
   * Start the Lnd process in Neutrino mode.
   * @return {Number} PID of the Lnd process that was started.
   */
  async start() {
    if (this.getPid()) {
      return Promise.reject(new Error(`Neutrino process with PID ${this.getPid()} already exists.`))
    }

    // The height returned from the LND log output may not be the actual current block height (this is the case
    // when BTCD is still in the middle of syncing the blockchain) so try to fetch thhe current height from from
    // some block explorers so that we have a good starting point.
    fetchBlockHeight(this.lndConfig.chain, this.lndConfig.network)
      .then(blockHeight => this.setCurrentBlockHeight(blockHeight))
      .catch(err => mainLog.warn(`Unable to fetch block height: ${err.message}`))

    // Get available ports.
    const [listen, restlisten] = await Promise.all([getLndListen('p2p'), getLndListen('rest')])

    mainLog.info('Starting lnd in neutrino mode with config: %o', this.lndConfig)
    mainLog.info(' > binaryPath', this.lndConfig.binaryPath)
    mainLog.info(' > chain', this.lndConfig.chain)
    mainLog.info(' > network', this.lndConfig.network)
    mainLog.info(' > host:', this.lndConfig.host)
    mainLog.info(' > cert:', this.lndConfig.cert)
    mainLog.info(' > macaroon:', this.lndConfig.macaroon)

    // Genreate autopilot config.
    const autopilotArgMap = {
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
    config.lnd.neutrino[this.lndConfig.chain][this.lndConfig.network].forEach(node =>
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

    // Attach error handler.
    this.process.on('error', error => {
      mainLog.error('Neutrino process received "error" event with error: %s', error)
      this.emit(NEUTRINO_ERROR, { error, lastError: this.lastError })
    })

    // Attach exit handler.
    this.process.on('exit', (code, signal) => {
      mainLog.info(
        'Neutrino process received "exit" event with code %s and signal %s',
        code,
        signal
      )
      this.emit(NEUTRINO_EXIT, { code, signal, lastError: this.lastError })
      this.resetState()
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
      if (line.includes('RPC server listening on') && line.includes('password')) {
        this.isWalletUnlockerGrpcActive = true
        this.isLightningGrpcActive = false
        this.emit(NEUTRINO_WALLET_UNLOCKER_GRPC_ACTIVE)
      }

      // RPC server listening (wallet unlocked).
      if (line.includes('RPC server listening on') && !line.includes('password')) {
        this.isLightningGrpcActive = true
        this.isWalletUnlockerGrpcActive = false
        this.emit(NEUTRINO_LIGHTNING_GRPC_ACTIVE)
      }

      // If the sync has already completed then we don't need to do anything else.
      if (this.is(NEUTRINO_CHAIN_SYNC_COMPLETE)) {
        return
      }

      if (this.is(NEUTRINO_CHAIN_SYNC_PENDING) || this.is(NEUTRINO_CHAIN_SYNC_IN_PROGRESS)) {
        // If we can't get a connectionn to the backend.
        if (
          line.includes('Waiting for chain backend to finish sync') ||
          line.includes('Waiting for block headers to sync, then will start cfheaders sync')
        ) {
          this.setState(NEUTRINO_CHAIN_SYNC_WAITING)
        }
        // If we are still waiting for the back end to finish synncing.
        if (line.includes('No sync peer candidates available')) {
          this.setState(NEUTRINO_CHAIN_SYNC_WAITING)
        }
      }

      // Lnd syncing has started or resumed.
      if (this.is(NEUTRINO_CHAIN_SYNC_PENDING) || this.is(NEUTRINO_CHAIN_SYNC_WAITING)) {
        const match =
          line.match(/Syncing to block height (\d+)/) ||
          line.match(/Starting cfilters sync at block_height=(\d+)/)

        if (match) {
          // Notify that chhain syncronisation has now started.
          this.setState(NEUTRINO_CHAIN_SYNC_IN_PROGRESS)

          // This is the latest block that BTCd is aware of.
          const btcdHeight = match[1]
          this.setCurrentBlockHeight(btcdHeight)
        }
      }

      // Lnd as received some updated block data.
      if (this.is(NEUTRINO_CHAIN_SYNC_WAITING) || this.is(NEUTRINO_CHAIN_SYNC_IN_PROGRESS)) {
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
          this.setState(NEUTRINO_CHAIN_SYNC_IN_PROGRESS)
          this.setNeutrinoBlockHeight(height)
        }

        if (cfilter) {
          this.setState(NEUTRINO_CHAIN_SYNC_IN_PROGRESS)
          this.setLndCfilterHeight(cfilter)
        }

        // Lnd syncing has completed.
        if (line.includes('Chain backend is fully synced')) {
          this.setState(NEUTRINO_CHAIN_SYNC_COMPLETE)
        }
      }
    })

    return this.process.pid
  }

  /**
   * Shutdown LND.
   */
  async shutdown(options = {}) {
    const signal = options.signal || 'SIGINT'
    const timeout = options.timeout || NEUTRINO_SHUTDOWN_TIMEOUT

    mainLog.info('Shutting down Neutrino...')

    if (!this.getPid()) {
      mainLog.info('No Neutrino process found.')
      return
    }

    await this._shutdownNeutrino(signal, timeout)
    mainLog.info('Neutrino shutdown complete.')
  }

  /**
   * Attempt to gracefully terminate the lnd process. If it fails, force kill it.
   * @param  {String}  signal  process signal
   * @param  {Number}  timeout timeout before force killing with SIGKILL
   * @return {Promise}
   */
  async _shutdownNeutrino(signal, timeout) {
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
   * Stop the Lnd process.
   */
  kill(signalName = 'SIGINT') {
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
  is(state) {
    return this.chainSyncStatus === state
  }

  /**
   * Set the current state and emit an event to notify others if the state as changed.
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
    const changed = Neutrino.incrementIfHigher(this, 'currentBlockHeight', heightAsNumber)
    if (changed) {
      this.emit(NEUTRINO_GOT_CURRENT_BLOCK_HEIGHT, heightAsNumber)
    }
  }

  /**
   * Set the lnd block height and emit an event to notify others if it has changed.
   * @param {String|Number} height Block height
   */
  setNeutrinoBlockHeight(height) {
    const heightAsNumber = Number(height)
    const changed = Neutrino.incrementIfHigher(this, 'neutrinoBlockHeight', heightAsNumber)
    if (changed) {
      this.emit(NEUTRINO_GOT_LND_BLOCK_HEIGHT, heightAsNumber)
      this.setCurrentBlockHeight(heightAsNumber)
    }
  }

  /**
   * Set the lnd cfilter height and emit an event to notify others if it has changed.
   * @param {String|Number} height Block height
   */
  setLndCfilterHeight(height) {
    const heightAsNumber = Number(height)
    const changed = Neutrino.incrementIfHigher(this, 'neutrinoCfilterHeight', heightAsNumber)
    if (changed) {
      this.emit(NEUTRINO_GOT_LND_CFILTER_HEIGHT, heightAsNumber)
      this.setCurrentBlockHeight(heightAsNumber)
    }
  }
}

export default Neutrino

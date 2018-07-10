import split2 from 'split2'
import { spawn } from 'child_process'
import EventEmitter from 'events'
import config from '../config'
import { mainLog, lndLog, lndLogGetLevel } from '../../utils/log'

class Neutrino extends EventEmitter {
  constructor(alias, autopilot) {
    super()
    this.alias = alias
    this.autopilot = autopilot
    this.process = null
    this.state = {
      grpcProxyStarted: false,
      walletOpened: false,
      chainSyncStarted: false,
      chainSyncFinished: false,
      currentBlockHeight: null,
      targetBlockHeight: null
    }
  }

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
      if (!this.state.grpcProxyStarted) {
        if (line.includes('gRPC proxy started') && line.includes('password')) {
          this.state.grpcProxyStarted = true
          this.emit('grpc-proxy-started')
        }
      }

      // Wallet opened.
      if (!this.state.walletOpened) {
        if (line.includes('gRPC proxy started') && !line.includes('password')) {
          this.state.walletOpened = true
          this.emit('wallet-opened')
        }
      }

      // LND syncing has started.
      if (!this.state.chainSyncStarted) {
        if (line.includes('Syncing to block height')) {
          const height = line.match(/Syncing to block height (\d+)/)[1]
          this.state.chainSyncStarted = true
          this.state.targetBlockHeight = height
          this.emit('chain-sync-started')
          this.emit('got-final-block-height', height)
        }
      }

      // LND syncing has completed.
      if (!this.state.chainSyncFinished) {
        if (line.includes('Chain backend is fully synced')) {
          this.state.chainSyncFinished = true
          this.emit('chain-sync-finished')
        }
      }

      // Pass current block height progress to front end for loading state UX
      if (this.state.chainSyncStarted) {
        if (line.includes('Downloading headers for blocks')) {
          const height = line.match(/Downloading headers for blocks (\d+) to \d+/)[1]
          this.emit('got-current-block-height', height)
        } else if (line.includes('Rescanned through block')) {
          const height = line.match(/Rescanned through block.+\(height (\d+)/)[1]
          this.emit('got-current-block-height', height)
        } else if (line.includes('Caught up to height')) {
          const height = line.match(/Caught up to height (\d+)/)[1]
          this.emit('got-current-block-height', height)
        } else if (line.startsWith('Processed') && line.includes('in the last')) {
          const height = line.match(/Processed \d* blocks? in the last.+\(height (\d+)/)[1]
          this.emit('got-current-block-height', height)
        }
      }
    })

    return this.process
  }

  stop() {
    if (this.process) {
      this.process.kill()
      this.process = null
    }
  }
}

export default Neutrino

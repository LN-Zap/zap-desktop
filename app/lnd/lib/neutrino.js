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
      if (line.includes('gRPC proxy started') && line.includes('password')) {
        this.emit('grpc-proxy-started')
      }

      // Wallet opened.
      if (line.includes('gRPC proxy started') && !line.includes('password')) {
        this.emit('wallet-opened')
      }

      // LND syncing has started.
      if (line.includes('Waiting for chain backend to finish sync')) {
        this.emit('chain-sync-started')
      }

      // LND syncing has completed.
      if (line.includes('Chain backend is fully synced')) {
        this.emit('chain-sync-finished')
      }

      // Pass current block height progress to front end for loading state UX
      if (line.includes('Rescanned through block')) {
        const height = line.match(/Rescanned through block.+\(height (\d*)/)[1]
        this.emit('got-block-height', height)
      } else if (line.includes('Caught up to height')) {
        const height = line.match(/Caught up to height (\d*)/)[1]
        this.emit('got-block-height', height)
      } else if (line.includes('in the last')) {
        const height = line.match(/Processed \d* blocks? in the last.+\(height (\d*)/)[1]
        this.emit('got-block-height', height)
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

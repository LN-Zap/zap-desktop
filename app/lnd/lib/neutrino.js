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

      // LND is all caught up to the blockchain.
      if (line.includes('Chain backend is fully synced')) {
        this.emit('fully-synced')
      }

      // Pass current block height progress to front end for loading state UX
      if (line.includes('Caught up to height') || line.includes('Catching up block hashes')) {
        this.emit('got-block-height', line)
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

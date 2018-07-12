import split2 from 'split2'
import { spawn } from 'child_process'
import EventEmitter from 'events'
import config from '../config'
import { mainLog, lndLog, lndLogGetLevel } from '../../utils/log'
import { fetchBlockHeight } from './util'

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
      chainSyncFinished: false
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
        const match = line.match(/Syncing to block height (\d+)/)
        if (match) {
          // Notify that chhain syncronisation has now started.
          this.state.chainSyncStarted = true
          this.emit('chain-sync-started')

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

      // LND syncing has completed.
      if (!this.state.chainSyncFinished) {
        if (line.includes('Chain backend is fully synced')) {
          this.state.chainSyncFinished = true
          this.emit('chain-sync-finished')
        }
      }

      // Pass current block height progress to front end for loading state UX
      if (this.state.chainSyncStarted) {
        let match
        if ((match = line.match(/Downloading headers for blocks (\d+) to \d+/))) {
          this.emit('got-lnd-block-height', match[1])
        } else if ((match = line.match(/Rescanned through block.+\(height (\d+)/))) {
          this.emit('got-lnd-block-height', match[1])
        } else if ((match = line.match(/Caught up to height (\d+)/))) {
          this.emit('got-lnd-block-height', match[1])
        } else if ((match = line.match(/Processed \d* blocks? in the last.+\(height (\d+)/))) {
          this.emit('got-lnd-block-height', match[1])
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

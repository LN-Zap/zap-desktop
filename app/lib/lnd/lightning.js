// @flow

import { credentials, loadPackageDefinition } from '@grpc/grpc-js'
import { loadSync } from '@grpc/proto-loader'
import { BrowserWindow } from 'electron'
import StateMachine from 'javascript-state-machine'
import LndConfig from './config'
import { getDeadline, createSslCreds, createMacaroonCreds, waitForFile } from './util'
import { validateHost } from '../utils/validateHost'
import methods from './methods'
import { mainLog } from '../utils/log'
import subscribeToTransactions from './subscribe/transactions'
import subscribeToInvoices from './subscribe/invoices'
import subscribeToChannelGraph from './subscribe/channelgraph'
import { getInfo } from './methods/networkController'

// Type definition for subscriptions property.
type LightningSubscriptionsType = {
  channelGraph: any,
  invoices: any,
  transactions: any
}

/**
 * Creates an LND grpc client lightning service.
 * @returns {Lightning}
 */
class Lightning {
  mainWindow: BrowserWindow
  service: any
  lndConfig: LndConfig
  subscriptions: LightningSubscriptionsType
  fsm: StateMachine

  constructor(lndConfig: LndConfig) {
    this.fsm = new StateMachine({
      init: 'ready',
      transitions: [
        { name: 'connect', from: 'ready', to: 'connected' },
        { name: 'disconnect', from: 'connected', to: 'ready' },
        { name: 'terminate', from: 'connected', to: 'ready' }
      ],
      methods: {
        onBeforeConnect: this.onBeforeConnect.bind(this),
        onBeforeDisconnect: this.onBeforeDisconnect.bind(this),
        onBeforeTerminate: this.onBeforeTerminate.bind(this)
      }
    })

    this.mainWindow = null
    this.service = null
    this.lndConfig = lndConfig
    this.subscriptions = {
      channelGraph: null,
      invoices: null,
      transactions: null
    }
  }

  // ------------------------------------
  // FSM Proxies
  // ------------------------------------

  connect(...args: any[]) {
    return this.fsm.connect(args)
  }
  disconnect(...args: any[]) {
    return this.fsm.disconnect(args)
  }
  terminate(...args: any[]) {
    return this.fsm.terminate(args)
  }
  is(...args: any[]) {
    return this.fsm.is(args)
  }
  can(...args: any[]) {
    return this.fsm.can(args)
  }

  // ------------------------------------
  // FSM Callbacks
  // ------------------------------------

  /**
   * Connect to the gRPC interface and verify it is functional.
   * @return {Promise<rpc.lnrpc.Lightning>}
   */
  async onBeforeConnect() {
    mainLog.info('Connecting to Lightning gRPC service')
    const { rpcProtoPath, host, cert, macaroon, type } = this.lndConfig

    // Verify that the host is valid before creating a gRPC client that is connected to it.
    return (
      validateHost(host)
        // If we are trying to connect to the internal lnd, wait upto 20 seconds for the macaroon to be generated.
        .then(() => (type === 'local' ? waitForFile(macaroon, 20000) : Promise.resolve()))
        // Attempt to connect using the supplied credentials.
        .then(async () => {
          // Load the gRPC proto file.
          // The following options object closely approximates the existing behavior of grpc.load.
          // See https://github.com/grpc/grpc-node/blob/master/packages/grpc-protobufjs/README.md
          const options = {
            keepCase: true,
            longs: Number,
            enums: String,
            defaults: true,
            oneofs: true
          }
          const packageDefinition = loadSync(rpcProtoPath, options)

          // Load gRPC package definition as a gRPC object hierarchy.
          const rpc = loadPackageDefinition(packageDefinition)

          // Create ssl and macaroon credentials to use with the gRPC client.
          const [sslCreds, macaroonCreds] = await Promise.all([
            createSslCreds(cert),
            createMacaroonCreds(macaroon)
          ])
          const creds = credentials.combineChannelCredentials(sslCreds, macaroonCreds)

          // Create a new gRPC client instance.
          this.service = new rpc.lnrpc.Lightning(host, creds)

          // Wait upto 20 seconds for the gRPC connection to be established.
          return new Promise((resolve, reject) => {
            this.service.waitForReady(getDeadline(20), err => {
              if (err) {
                return reject(err)
              }
              return resolve()
            })
          })
        })
        // Once connected, make a call to getInfo to verify that we can make successful calls.
        .then(() => getInfo(this.service))
        .catch(err => {
          if (this.service) {
            this.service.close()
          }
          throw err
        })
    )
  }

  /**
   * Discomnnect the gRPC service.
   */
  onBeforeDisconnect() {
    mainLog.info('Disconnecting from Lightning gRPC service')
    this.unsubscribe()
    if (this.service) {
      this.service.close()
    }
  }

  /**
   * Gracefully shutdown the gRPC service.
   */
  async onBeforeTerminate() {
    mainLog.info('Shutting down Lightning daemon')
    this.unsubscribe()
    return new Promise((resolve, reject) => {
      this.service.stopDaemon({}, (err, data) => {
        if (err) {
          return reject(err)
        }
        resolve(data)
      })
    })
  }

  // ------------------------------------
  // Helpers
  // ------------------------------------

  /**
   * Hook up lnd restful methods.
   */
  registerMethods(event: Event, msg: string, data: any) {
    return methods(this.service, mainLog, event, msg, data)
  }

  /**
   * Subscribe to all bi-directional streams.
   */
  subscribe(mainWindow: BrowserWindow) {
    mainLog.info('Subscribing to Lightning gRPC streams')
    this.mainWindow = mainWindow

    this.subscriptions.channelGraph = subscribeToChannelGraph.call(this)
    this.subscriptions.invoices = subscribeToInvoices.call(this)
    this.subscriptions.transactions = subscribeToTransactions.call(this)
  }

  /**
   * Unsubscribe from all bi-directional streams.
   */
  unsubscribe() {
    mainLog.info('Unsubscribing from Lightning gRPC streams')
    this.mainWindow = null
    Object.keys(this.subscriptions).forEach(subscription => {
      if (this.subscriptions[subscription]) {
        this.subscriptions[subscription].cancel()
        this.subscriptions[subscription] = null
      }
    })
  }
}

export default Lightning

// @flow

import { join } from 'path'
import { credentials, loadPackageDefinition } from '@grpc/grpc-js'
import { load } from '@grpc/proto-loader'
import lndgrpc from 'lnd-grpc'
import { BrowserWindow } from 'electron'
import StateMachine from 'javascript-state-machine'
import LndConfig from './config'
import {
  grpcOptions,
  lndGpcProtoPath,
  getDeadline,
  createSslCreds,
  createMacaroonCreds,
  waitForFile
} from './util'
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

const _version = new WeakMap()

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

  // Define a read only getter property that returns the version of the api we are connected to, once known.
  get version() {
    return _version.get(this)
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
    const { host, macaroon, type } = this.lndConfig

    // Verify that the host is valid before creating a gRPC client that is connected to it.
    return (
      validateHost(host)
        // If we are trying to connect to the internal lnd, wait upto 20 seconds for the macaroon to be generated.
        .then(() => {
          if (type === 'local') {
            return waitForFile(macaroon, 20000)
          }
          return
        })

        // Attempt to connect using the supplied credentials.
        .then(() => this.establishConnection())

        // Once connected, make a call to getInfo in order to determine the api version.
        .then(() => getInfo(this.service))

        // Determine most relevant proto version and reconnect using the right rpc.proto if we need to.
        .then(async info => {
          const [closestProtoVersion, latestProtoVersion] = await Promise.all([
            lndgrpc.getClosestProtoVersion(info.version, lndGpcProtoPath()),
            lndgrpc.getLatestProtoVersion(lndGpcProtoPath())
          ])
          if (closestProtoVersion !== latestProtoVersion) {
            mainLog.debug(
              'Found better match. Reconnecting using rpc.proto version: %s',
              closestProtoVersion
            )
            this.service.close()
            return this.establishConnection(closestProtoVersion)
          }
          return
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
   * Establish a connection to the Lightning interface.
   */
  async establishConnection(version: ?string) {
    const { host, cert, macaroon } = this.lndConfig

    // Find the rpc.proto file to use. If no version was supplied, attempt to use the latest version.
    const versionToUse = version || (await lndgrpc.getLatestProtoVersion(lndGpcProtoPath()))
    const filepath = join(lndGpcProtoPath(), `${versionToUse}.proto`)
    mainLog.debug('Establishing gRPC connection with proto file %s', filepath)

    // Save the version into a read only property that can be read from the outside.
    _version.set(this, versionToUse)

    // Load gRPC package definition as a gRPC object hierarchy.
    const packageDefinition = await load(filepath, grpcOptions)
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
          this.service.close()
          return reject(err)
        }
        return resolve()
      })
    })
  }

  /**
   * Hook up lnd restful methods.
   */
  registerMethods(event: Event, msg: string, data: any) {
    return methods(this, mainLog, event, msg, data)
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

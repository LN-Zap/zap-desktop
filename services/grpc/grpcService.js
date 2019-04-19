import { join } from 'path'
import EventEmitter from 'events'
import { credentials, loadPackageDefinition, status } from '@grpc/grpc-js'
import { load } from '@grpc/proto-loader'
import lndgrpc from 'lnd-grpc'
import StateMachine from 'javascript-state-machine'
import { grpcLog } from '@zap/utils/log'
import promisifiedCall from '@zap/utils/promisifiedCall'
import waitForFile from '@zap/utils/waitForFile'
import grpcOptions from '@zap/utils/grpcOptions'
import getDeadline from '@zap/utils/getDeadline'
import createSslCreds from '@zap/utils/createSslCreds'
import createMacaroonCreds from '@zap/utils/createMacaroonCreds'

export const SUPPORTED_SERVICES = ['WalletUnlocker', 'Lightning']

/**
 * Creates an lnd grpc client service.
 * @returns {GrpcService}
 */
class GrpcService extends EventEmitter {
  constructor(serviceName, lndConfig) {
    super()
    this.serviceName = serviceName

    this.fsm = new StateMachine({
      init: 'ready',
      transitions: [
        { name: 'connect', from: 'ready', to: 'connected' },
        { name: 'activate', from: 'connected', to: 'active' },
        { name: 'disconnect', from: ['connected', 'active'], to: 'ready' },
      ],
      methods: {
        onBeforeConnect: this.onBeforeConnect.bind(this),
        onAfterConnect: this.onAfterConnect.bind(this),
        onBeforeActivate: this.onBeforeActivate.bind(this),
        onAfterActivate: this.onAfterActivate.bind(this),
        onBeforeDisconnect: this.onBeforeDisconnect.bind(this),
      },
    })

    this.subscriptions = []
    this.useMacaroon = true
    this.service = null
    this.lndConfig = lndConfig
  }

  // ------------------------------------
  // FSM Proxies
  // ------------------------------------

  connect(...args) {
    return this.fsm.connect(args)
  }
  activate(...args) {
    return this.fsm.activate(args)
  }
  disconnect(...args) {
    return this.fsm.disconnect(args)
  }
  is(...args) {
    return this.fsm.is(args)
  }
  can(...args) {
    return this.fsm.can(args)
  }

  // ------------------------------------
  // FSM Callbacks
  // ------------------------------------

  /**
   * Connect to the gRPC interface.
   */
  async onBeforeConnect() {
    grpcLog.info(`Connecting to ${this.serviceName} gRPC service`)
    await this.establishConnection()
  }

  /**
   * Log successful connection.
   */
  async onAfterConnect() {
    grpcLog.info(`Connected to ${this.serviceName} gRPC service`)
  }

  /**
   * Subscribe to streams.
   */
  async onBeforeActivate() {
    grpcLog.info(`Activating ${this.serviceName} gRPC service`)
    await this.subscribe()
  }

  /**
   * Subscribe to streams.
   */
  async onAfterActivate() {
    grpcLog.info(`Activated ${this.serviceName} gRPC service`)
  }

  /**
   * Disconnect from the gRPC service.
   */
  async onBeforeDisconnect() {
    grpcLog.info(`Disconnecting from ${this.serviceName} gRPC service`)
    await this.unsubscribe()
    if (this.service) {
      this.service.close()
    }
  }

  // ------------------------------------
  // Helpers
  // ------------------------------------

  /**
   * Establish a connection to the Lightning interface.
   */
  async establishConnection(version) {
    const { id, type, host, cert, macaroon, protoPath } = this.lndConfig

    // Find the most recent rpc.proto file
    const versionToUse = version || (await lndgrpc.getLatestProtoVersion({ path: protoPath }))
    const filepath = join(protoPath, `${versionToUse}.proto`)
    grpcLog.info('Establishing gRPC connection with proto file %s', filepath)

    // Load gRPC package definition as a gRPC object hierarchy.
    const packageDefinition = await load(filepath, grpcOptions)
    const rpc = loadPackageDefinition(packageDefinition)

    // Create ssl credentials to use with the gRPC client.
    let creds = await createSslCreds(cert)

    // Add macaroon to crenentials if service requires macaroons.
    if (this.useMacaroon) {
      // If we are trying to connect to the internal lnd, wait up to 20 seconds for the macaroon to be generated.
      if (type === 'local' && id !== 'tmp') {
        await waitForFile(macaroon, 20000)
      }

      const macaroonCreds = await createMacaroonCreds(macaroon)
      creds = credentials.combineChannelCredentials(creds, macaroonCreds)
    }

    // Create a new gRPC client instance.
    this.service = new rpc.lnrpc[this.serviceName](host, creds)

    try {
      // Wait up to 10 seconds for the gRPC connection to be established.
      return await promisifiedCall(this.service, this.service.waitForReady, getDeadline(10))
    } catch (e) {
      grpcLog.warn(`Unable to connect to ${this.serviceName} service`, e)
      this.service.close()
      throw e
    }
  }

  /**
   * Subscribe to streams.
   * Subclasses should implement this and add subscription streams to this.subscriptions.
   */
  subscribe() {
    // this.subscriptions['something'] = this.service.subscribeToSomething()
  }

  /**
   * Unsubscribe from all streams.
   */
  async unsubscribe() {
    const activeSubKeys = Object.keys(this.subscriptions)
    if (activeSubKeys.length) {
      grpcLog.info(`Unsubscribing from all ${this.serviceName} gRPC streams: %o`, activeSubKeys)
      const cancellations = activeSubKeys.map(key => this._cancelSubscription(key))
      return Promise.all(cancellations)
    }
  }

  /**
   * Unsubscribe from a single stream.
   */
  async _cancelSubscription(key) {
    grpcLog.info(`Unsubscribing from ${key} gRPC stream`)
    const call = this.subscriptions[key]

    // Cancellation status callback handler.
    const result = new Promise(resolve => {
      call.on('status', callStatus => {
        if (callStatus.code === status.CANCELLED) {
          grpcLog.info(`Unsubscribed from ${key} gRPC stream`)
          resolve()
        }
      })
    })

    // Initiate cancellation request.
    call.cancel()
    // Resolve once we recieve confirmation of the call's cancellation.
    return result
  }
}

export default GrpcService

import { join } from 'path'
import EventEmitter from 'events'
import intersection from 'lodash.intersection'
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

/**
 * Base class for lnd gRPC services.
 * @extends EventEmitter
 */
class GrpcService extends EventEmitter {
  constructor(serviceName, lndConfig) {
    super()
    this.serviceName = serviceName

    this.fsm = new StateMachine({
      init: 'ready',
      transitions: [
        { name: 'connect', from: 'ready', to: 'connected' },
        { name: 'disconnect', from: 'connected', to: 'ready' },
      ],
      methods: {
        onBeforeConnect: this.onBeforeConnect.bind(this),
        onAfterConnect: this.onAfterConnect.bind(this),
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

    // Establish a connection.
    const { useMacaroon, waitForMacaroon } = this._getConnectionSettings()
    await this.establishConnection({ useMacaroon, waitForMacaroon })
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
  async establishConnection(options = {}) {
    const { version, useMacaroon, waitForMacaroon } = options
    const { host, cert, macaroon, protoPath } = this.lndConfig

    // Find the most recent rpc.proto file
    const versionToUse = version || (await lndgrpc.getLatestProtoVersion({ path: protoPath }))
    const filepath = join(protoPath, `${versionToUse}.proto`)
    grpcLog.info(`Establishing gRPC connection to ${this.serviceName} with proto file %s`, filepath)

    // Load gRPC package definition as a gRPC object hierarchy.
    const packageDefinition = await load(filepath, grpcOptions)
    const rpc = loadPackageDefinition(packageDefinition)

    // Create ssl credentials to use with the gRPC client.
    let creds = await createSslCreds(cert)

    // Add macaroon to crenentials if service requires macaroons.
    if (useMacaroon) {
      // If we are trying to connect to the internal lnd, wait up to 20 seconds for the macaroon to be generated.
      if (waitForMacaroon) {
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

  /**
   * @param {...string} services optional list of services to subscribe to. if omitted, uses all services
   * @services must be a subset of `this.subscriptions`
   * @memberof GrpcService
   */

  subscribe(...services) {
    // this.subscriptions['something'] = this.service.subscribeToSomething()
    // super.subscribe()
    const allSubKeys = Object.keys(this.subscriptions)
    // make sure we are subscribing to known services if a specific list is provided
    const activeSubKeys =
      services && services.length ? intersection(allSubKeys, services) : allSubKeys
    // Close and clear subscriptions when they emit an end event.
    activeSubKeys.forEach(key => {
      const call = this.subscriptions[key]
      call.on('end', () => {
        grpcLog.info(`gRPC subscription "${this.serviceName}.${key}" ended.`)
        delete this.subscriptions[key]
      })

      call.on('status', callStatus => {
        if (callStatus.code === status.CANCELLED) {
          delete this.subscriptions[key]
          grpcLog.info(`gRPC subscription "${this.serviceName}.${key}" ended.`)
        }
      })
    })
  }

  /**
   * Unsubscribe from all streams.
   * @param {...string} services optional list of services to unsubscribe from. if omitted, uses all services
   * @services must be a subset of `this.subscriptions`
   */
  async unsubscribe(...services) {
    const allSubKeys = Object.keys(this.subscriptions)
    // make sure we are unsubscribing from known services if a specific list is provided
    const activeSubKeys =
      services && services.length ? intersection(allSubKeys, services) : allSubKeys
    grpcLog.info(`Unsubscribing from all ${this.serviceName} gRPC streams: %o`, activeSubKeys)
    const cancellations = activeSubKeys.map(key => this._cancelSubscription(key))
    await Promise.all(cancellations)
  }

  /**
   * Unsubscribe from a single stream.
   */
  async _cancelSubscription(key) {
    grpcLog.info(`Unsubscribing from ${this.serviceName}.${key} gRPC stream`)
    const call = this.subscriptions[key]

    // Cancellation status callback handler.
    const result = new Promise(resolve => {
      call.on('status', callStatus => {
        if (callStatus.code === status.CANCELLED) {
          delete this.subscriptions[key]
          grpcLog.info(`Unsubscribed from ${this.serviceName}.${key} gRPC stream`)
          resolve()
        }
      })

      call.on('end', () => {
        delete this.subscriptions[key]
        grpcLog.info(`Unsubscribed from ${this.serviceName}.${key} gRPC stream`)
        resolve()
      })
    })

    // Initiate cancellation request.
    call.cancel()
    // Resolve once we receive confirmation of the call's cancellation.
    return result
  }

  _getConnectionSettings() {
    const { id, type } = this.lndConfig
    // Don't use macaroons when connecting to the local tmp instance.
    const useMacaroon = this.useMacaroon && id !== 'tmp'
    // If connecting to a local instance, wait for the macaroon file to exist.
    const waitForMacaroon = type === 'local'

    return { waitForMacaroon, useMacaroon }
  }
}

export default GrpcService

import { join } from 'path'
import EventEmitter from 'events'
import { loadPackageDefinition } from '@grpc/grpc-js'
import { load } from '@grpc/proto-loader'
import lndgrpc from 'lnd-grpc'
import StateMachine from 'javascript-state-machine'
import validateHost from '@zap/utils/validateHost'
import { mainLog } from '@zap/utils/log'
import grpcOptions from '@zap/utils/grpcOptions'
import getDeadline from '@zap/utils/getDeadline'
import createSslCreds from '@zap/utils/createSslCreds'

export const SUPPORTED_SERVICES = ['WalletUnlocker', 'Lightning']

/**
 * Creates an lnd grpc client service.
 * @returns {GrpcService}
 */
class GrpcService extends EventEmitter {
  constructor() {
    super()
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
        onAfterDisconnect: this.onAfterDisconnect.bind(this),
      },
    })
    this.subscriptions = []
    this.serviceName = null
    this.service = null
    this.lndConfig = null
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
    if (!SUPPORTED_SERVICES.includes(this.serviceName)) {
      throw new Error(
        `Unsupported service (supported services are ${SUPPORTED_SERVICES.join(', ')})`
      )
    }

    // Initialise the lnd config
    mainLog.info(`Initializing ${this.serviceName} with lndConfig: %o`, lndConfig)
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
   * Connect to the gRPC interface and verify it is functional.
   * @return {Promise<rpc.lnrpc.[serviceName]>}
   */
  async onBeforeConnect() {
    mainLog.info(`Connecting to ${this.serviceName} gRPC service`)
    const { host } = this.lndConfig

    // Verify that the host is valid before creating a gRPC client that is connected to it.
    return validateHost(host).then(() => this.establishConnection())
  }

  onAfterConnect() {}

  /**
   * Discomnnect the gRPC service.
   */
  onBeforeDisconnect() {
    mainLog.info(`Disconnecting from ${this.serviceName} gRPC service`)
    if (this.service) {
      this.service.close()
    }
  }

  onAfterDisconnect() {}

  // ------------------------------------
  // Helpers
  // ------------------------------------

  /**
   * Establish a connection to the Lightning interface.
   */
  async establishConnection() {
    const { host, cert, protoPath } = this.lndConfig

    // Find the most recent rpc.proto file
    const version = await lndgrpc.getLatestProtoVersion({ path: protoPath })
    const filepath = join(protoPath, `${version}.proto`)
    mainLog.info('Establishing gRPC connection with proto file %s', filepath, filepath, grpcOptions)

    // Load gRPC package definition as a gRPC object hierarchy.
    const packageDefinition = await load(filepath, grpcOptions)
    const rpc = loadPackageDefinition(packageDefinition)

    // Create ssl credentials to use with the gRPC client.
    const sslCreds = await createSslCreds(cert)

    // Create a new gRPC client instance.
    this.service = new rpc.lnrpc[this.serviceName](host, sslCreds)

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
}

export default GrpcService

import EventEmitter from 'events'
import StateMachine from 'javascript-state-machine'
import { status } from '@grpc/grpc-js'
import validateHost from '@zap/utils/validateHost'
import { grpcLog } from '@zap/utils/log'
import WalletUnlocker from './walletUnlocker'
import Lightning from './lightning'

const WALLET_STATE_LOCKED = 'WALLET_STATE_LOCKED'
const WALLET_STATE_ACTIVE = 'WALLET_STATE_ACTIVE'

/**
 * Creates an lnd grpc client service.
 * @returns {GrpcService}
 */
class GrpcService extends EventEmitter {
  constructor() {
    super()
    this.fsm = new StateMachine({
      init: 'pending',
      transitions: [
        { name: 'init', from: 'pending', to: 'ready' },
        { name: 'connect', from: 'ready', to: 'connected' },
        { name: 'activateWalletUnlocker', from: 'connected', to: 'locked' },
        { name: 'activateLightning', from: ['connected', 'locked'], to: 'active' },
        { name: 'disconnect', from: ['connected', 'locked', 'active'], to: 'ready' },
      ],
      methods: {
        onBeforeConnect: this.onBeforeConnect.bind(this),
        onAfterConnect: this.onAfterConnect.bind(this),
        onBeforeActivateWalletUnlocker: this.onBeforeActivateWalletUnlocker.bind(this),
        onBeforeActivateLightning: this.onBeforeActivateLightning.bind(this),
        onBeforeDisconnect: this.onBeforeDisconnect.bind(this),
        onAfterDisconnect: this.onAfterDisconnect.bind(this),
      },
    })
    this.supportedServices = [WalletUnlocker, Lightning]
    this.services = {}
    this.fsm.init()
  }

  /**
   * Initialize the service.
   * @param {LndConfig} lndConfig configuration.
   */
  init(lndConfig) {
    grpcLog.info(`Initializing lnd gRPC with config: %o`, lndConfig)
    this.lndConfig = lndConfig

    // Instantiate individual services.
    this.supportedServices.forEach(Service => {
      const instance = new Service(this.lndConfig)
      this.services[instance.serviceName] = instance
    })

    // Set up a listener to move things forward when a wallet has been unlocked.
    this.services.WalletUnlocker.on('UNLOCK_WALLET_SUCCESS', async () => {
      this.fsm.activateLightning()
    })
  }

  // ------------------------------------
  // FSM Proxies
  // ------------------------------------

  is(...args) {
    return this.fsm.is(args)
  }
  can(...args) {
    return this.fsm.can(args)
  }
  async connect(...args) {
    // First, connect to all gRPC services.
    await this.fsm.connect(args)

    // Once connected, determine the wallet state.
    const walletState = await this.determineWalletState()
    grpcLog.info('Determined wallet state as: %s', walletState)

    // Update our state accordingly.
    switch (walletState) {
      case WALLET_STATE_LOCKED:
        await this.fsm.activateWalletUnlocker()
        break

      case WALLET_STATE_ACTIVE:
        await this.fsm.activateLightning()
        break
    }
  }
  async disconnect(...args) {
    return this.fsm.disconnect(args)
  }

  // ------------------------------------
  // FSM Observers
  // ------------------------------------

  /**
   * Connect to the gRPC service.
   */
  async onBeforeConnect() {
    grpcLog.info(`Connecting to lnd gRPC service`)

    // Verify that the host is valid.
    const { host } = this.lndConfig
    await validateHost(host)

    // Connect to all services.
    await this.connectAll()
  }

  /**
   * Log successful connection.
   */
  async onAfterConnect() {
    grpcLog.info(`Connected to lnd gRPC service`)
  }

  /**
   * Disconnect from the gRPC service.
   */
  async onBeforeDisconnect() {
    grpcLog.info(`Disconnecting from lnd gRPC service`)
    await this.disconnectAll()
  }

  /**
   * Log successful disconnect.
   */
  async onAfterDisconnect() {
    grpcLog.info('Disconnected from lnd gRPC service')
  }

  /**
   * Rejig connections as needed before activating the wallet unlocker service.
   */
  async onBeforeActivateWalletUnlocker() {
    if (this.services.Lightning.can('disconnect')) {
      await this.services.Lightning.disconnect()
    }
    if (this.services.WalletUnlocker.can('connect')) {
      await this.services.WalletUnlocker.connect()
    }
    await this.services.WalletUnlocker.activate()
  }

  /**
   * Rejig connections as needed before activating the lightning service.
   */
  async onBeforeActivateLightning() {
    if (this.services.WalletUnlocker.can('disconnect')) {
      await this.services.WalletUnlocker.disconnect()
    }
    if (this.services.Lightning.can('connect')) {
      await this.services.Lightning.connect()
    }
    await this.services.Lightning.activate()
  }

  // ------------------------------------
  // Helpers
  // ------------------------------------

  /**
   * Connect all services.
   */
  async connectAll() {
    grpcLog.info('Connecting to all gRPC services')
    await Promise.all(
      Object.keys(this.services).map(serviceName => {
        const service = this.services[serviceName]
        if (service && service.can('connect')) {
          return service.connect()
        }
      })
    )
  }

  /**
   * Disconnect all services.
   */
  async disconnectAll() {
    grpcLog.info('Disconnecting from all gRPC services')
    await Promise.all(
      Object.keys(this.services).map(serviceName => {
        const service = this.services[serviceName]
        if (service && service.can('disconnect')) {
          return service.disconnect()
        }
      })
    )
  }

  /**
   * Probe to determine what sate lnd is in.
   */
  async determineWalletState() {
    grpcLog.info('Attempting to determine wallet state')
    try {
      await this.services.WalletUnlocker.unlockWallet('null')
    } catch (e) {
      switch (e.code) {
        /*
          `UNIMPLEMENTED` indicates that the requested operation is not implemented or not supported/enabled in the
           service. This implies that the wallet is already unlocked, since the WalletUnlocker service is not active.
           See https://github.com/grpc/grpc-node/blob/master/packages/grpc-native-core/src/constants.js#L129
         */
        case status.UNIMPLEMENTED:
          return WALLET_STATE_ACTIVE

        /**
          `UNKNOWN` indicates that unlockWallet was called without an argument which is invalid.
          This implies that the wallet is waiting to be unlocked.
        */
        case status.UNKNOWN:
          return WALLET_STATE_LOCKED

        /**
          Bubble all other errors back to the caller and abort the connectiopn attempt.
          Disconnect all services.
        */
        default:
          grpcLog.warn('Unable to connect to lnd service', e)
          try {
            await this.disconnectAll()
          } catch (e) {
            grpcLog.warn('There was a problem disconnecting gRPC services', e)
          }
          throw e
      }
    }
  }
}

export default GrpcService

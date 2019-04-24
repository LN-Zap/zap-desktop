import EventEmitter from 'events'
import StateMachine from 'javascript-state-machine'
import { proxyValue } from 'comlinkjs'
import snakecase from 'lodash.snakecase'
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
        { name: 'activateWalletUnlocker', from: ['ready', 'active'], to: 'locked' },
        { name: 'activateLightning', from: ['ready', 'locked'], to: 'active' },
        { name: 'disconnect', from: ['locked', 'active'], to: 'ready' },
      ],
      methods: {
        onBeforeActivateWalletUnlocker: this.onBeforeActivateWalletUnlocker.bind(this),
        onAfterActivateWalletUnlocker: this.onAfterActivateWalletUnlocker.bind(this),
        onBeforeActivateLightning: this.onBeforeActivateLightning.bind(this),
        onAfterActivateLightning: this.onAfterActivateLightning.bind(this),
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

    // Activate the lightning interfae as soon as the WalletUnlocker has been unlocked.
    this.services.WalletUnlocker.on('UNLOCK_WALLET_SUCCESS', async () => {
      this.activateLightning()
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

  async connect() {
    grpcLog.info(`Connecting to lnd gRPC service`)

    // Verify that the host is valid.
    const { host } = this.lndConfig
    await validateHost(host)

    // Probe the services to determine the wallet state.
    const walletState = await this.determineWalletState()

    // Update our state accordingly.
    switch (walletState) {
      case WALLET_STATE_LOCKED:
        await this.activateWalletUnlocker()
        break

      case WALLET_STATE_ACTIVE:
        await this.activateLightning()
        break

      default:
        throw new Error('Unable to determine wallet state')
    }
  }

  async disconnect(...args) {
    return this.fsm.disconnect(args)
  }

  async activateWalletUnlocker(...args) {
    return this.fsm.activateWalletUnlocker(args)
  }

  async activateLightning(...args) {
    return this.fsm.activateLightning(args)
  }

  // ------------------------------------
  // FSM Observers
  // ------------------------------------

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
    await this.services.WalletUnlocker.connect()
  }
  async onAfterActivateWalletUnlocker() {
    this.emit('GRPC_WALLET_UNLOCKER_SERVICE_ACTIVE')
  }

  /**
   * Rejig connections as needed before activating the lightning service.
   */
  async onBeforeActivateLightning() {
    await this.services.Lightning.connect()
  }
  async onAfterActivateLightning() {
    this.emit('GRPC_LIGHTNING_SERVICE_ACTIVE')
  }

  // ------------------------------------
  // Helpers
  // ------------------------------------

  /**
   * Disconnect all services.
   */
  async disconnectAll() {
    grpcLog.info('Disconnecting from all gRPC services')
    await Promise.all(
      Object.keys(this.services).map(serviceName => {
        const service = this.services[serviceName]
        if (service.can('disconnect')) {
          return service.disconnect()
        }
      })
    )
  }

  /**
   * Probe to determine what state lnd is in.
   */
  async determineWalletState() {
    grpcLog.info('Attempting to determine wallet state')
    try {
      await this.services.WalletUnlocker.connect()
      await this.services.WalletUnlocker.unlockWallet('null')
    } catch (error) {
      switch (error.code) {
        /*
          `UNIMPLEMENTED` indicates that the requested operation is not implemented or not supported/enabled in the
           service. This implies that the wallet is already unlocked, since the WalletUnlocker service is not active.
           See https://github.com/grpc/grpc-node/blob/master/packages/grpc-native-core/src/constants.js#L129
         */
        case status.UNIMPLEMENTED:
          grpcLog.info('Determined wallet state as:', WALLET_STATE_ACTIVE)
          return WALLET_STATE_ACTIVE

        /**
          `UNKNOWN` indicates that unlockWallet was called without an argument which is invalid.
          This implies that the wallet is waiting to be unlocked.
        */
        case status.UNKNOWN:
          grpcLog.info('Determined wallet state as:', WALLET_STATE_LOCKED)
          return WALLET_STATE_LOCKED

        /**
          Bubble all other errors back to the caller and abort the connection attempt.
          Disconnect all services.
        */
        default:
          grpcLog.warn('Unable to determine wallet state', error)
          throw error
      }
    } finally {
      if (this.services.WalletUnlocker.can('disconnect')) {
        await this.services.WalletUnlocker.disconnect()
      }
    }
  }

  /**
   * Wait for a service to become active.
   * @return {Promise<Object>} Object with `isActive` and `cancel` properties.
   */
  /**
   * Wait for a service to become active.
   * @param  {String} serviceName Name of service to wait for (Lightning, or WalletUnlocker)
   * @return {Promise<Object>}     Object with `isActive` and `cancel` properties.
   */
  waitForService(serviceName) {
    let successHandler
    const activationEventName = `GRPC_${snakecase(serviceName).toUpperCase()}_SERVICE_ACTIVE`

    /**
     * Promise that resolves when service is active.
     */
    const isActive = new Promise(async resolve => {
      // If the service is already active, return immediately.
      if (this.services[serviceName].is('connected')) {
        return resolve()
      }
      // Otherwise, wait until we receive an activation event from the gRPC service.
      successHandler = () => resolve()
      this.prependOnceListener(activationEventName, successHandler)
    })

    /**
     * Method to abort the wait (prevent the isActive from resolving and remove activation event listener).
     */
    const cancel = () => {
      if (successHandler) {
        this.off(activationEventName, successHandler)
        successHandler = null
      }
    }

    return proxyValue({ isActive, cancel })
  }
}

export default GrpcService

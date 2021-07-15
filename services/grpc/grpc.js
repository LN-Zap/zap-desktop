import EventEmitter from 'events'

import { status } from '@grpc/grpc-js'
import { proxy } from 'comlink'
import LndGrpc from 'lnd-grpc'
import intersection from 'lodash/intersection'

import delay from '@zap/utils/delay'
import { forwardAll, unforwardAll } from '@zap/utils/events'
import isObject from '@zap/utils/isObject'
import { grpcLog } from '@zap/utils/log'
import promiseTimeout from '@zap/utils/promiseTimeout'

import lightningMethods from './lightning.methods'
import lightningSubscriptions from './lightning.subscriptions'
import routerMethods from './router.methods'
import routerSubscriptions from './router.subscriptions'

const GRPC_WALLET_UNLOCKER_SERVICE_ACTIVE = 'GRPC_WALLET_UNLOCKER_SERVICE_ACTIVE'
const GRPC_LIGHTNING_SERVICE_ACTIVE = 'GRPC_LIGHTNING_SERVICE_ACTIVE'

const GRPC_TOR_PROXY_STARTING = 'GRPC_TOR_PROXY_STARTING'
const GRPC_TOR_PROXY_ACTIVE = 'GRPC_TOR_PROXY_ACTIVE'

// Timeout for WalletUnlocker actions.
const WALLET_UNLOCKER_TIMEOUT = 1000 * 60

/**
 * LND gRPC wrapper.
 *
 * @augments EventEmitter
 */
class ZapGrpc extends EventEmitter {
  /**
   * State properties that should be reset after a disconnect.
   *
   * @type {object}
   */
  static VOLATILE_STATE = {
    options: {},
    services: {},
    activeSubscriptions: {},
  }

  constructor() {
    super()

    this.availableSubscriptions = {}
    this.registerSubscription('invoices', 'Lightning', 'subscribeInvoices')
    this.registerSubscription('transactions', 'Lightning', 'subscribeTransactions')
    this.registerSubscription('channelgraph', 'Lightning', 'subscribeChannelGraph')
    this.registerSubscription('info', 'Lightning', 'subscribeGetInfo')
    this.registerSubscription('backups', 'Lightning', 'subscribeChannelBackups')
    this.registerSubscription('htlcs', 'Router', 'subscribeHtlcEvents')

    Object.assign(this, ZapGrpc.VOLATILE_STATE)
  }

  /**
   * connect - Initiate gRPC connection.
   *
   * @param {object} options Connection options
   * @returns {LndGrpc} LndGrpc connection
   */
  connect(options) {
    if (this.grpc && this.grpc.state !== 'ready') {
      throw new Error('Can not connect (already connected)')
    }

    this.options = options

    // Create a new grpc instance using settings from init options.
    const grpcOptions = this.getConnectionSettings()
    this.grpc = new LndGrpc(grpcOptions)

    // Set up service accessors.
    this.services = this.grpc.services

    // Inject helper methods.
    Object.assign(this.services.Lightning, lightningMethods)
    Object.assign(this.services.Lightning, lightningSubscriptions)

    Object.assign(this.services.Router, routerMethods)
    Object.assign(this.services.Router, routerSubscriptions)

    // Setup gRPC event handlers.
    this.grpc.on('locked', () => {
      this.emit(GRPC_WALLET_UNLOCKER_SERVICE_ACTIVE)
    })
    this.grpc.on('active', () => {
      this.emit(GRPC_LIGHTNING_SERVICE_ACTIVE)
      this.subscribeAll()
    })
    this.grpc.on('tor.starting', () => {
      this.emit(GRPC_TOR_PROXY_STARTING)
    })
    this.grpc.on('tor.started', () => {
      this.emit(GRPC_TOR_PROXY_ACTIVE)
    })

    // Connect the service.
    return this.grpc.connect(options)
  }

  /**
   * unlock - Unlock gRPC service.
   *
   * @param {string} password Password
   * @returns {Promise} Promise that resolves after unlocking a wallet and connecting to the Lightning interface.
   */
  async unlock(password) {
    const { grpc } = this
    try {
      await grpc.services.WalletUnlocker.unlockWallet({ walletPassword: Buffer.from(password) })
    } catch (e) {
      if (e.code !== status.UNAVAILABLE) {
        grpcLog.error(`Error when trying to connect to LND grpc: %o`, e)
        throw e
      }
    }
    await grpc.activateLightning()
  }

  /**
   * initWallet - Create / Restore wallet.
   *
   * @param {object} payload Payload
   * @returns {Promise} Promise that resolves after creating wallet and connecting to the Lightning interface.
   */
  async initWallet(payload) {
    try {
      const { grpc } = this
      await promiseTimeout(
        WALLET_UNLOCKER_TIMEOUT,
        grpc.services.WalletUnlocker.initWallet(payload)
      )
      return await promiseTimeout(WALLET_UNLOCKER_TIMEOUT, grpc.activateLightning())
    } catch (e) {
      grpcLog.error(`Error when trying to create wallet: %o`, e)
      throw e
    }
  }

  /**
   * disconnect - Disconnect gRPC service.
   *
   * @param {...object} args Disconnect args
   */
  async disconnect(...args) {
    await this.unsubscribe()

    if (this.grpc) {
      if (this.grpc.can('disconnect')) {
        await this.grpc.disconnect(args)
      }
      // Remove gRPC event handlers.
      this.grpc.removeAllListeners('locked')
      this.grpc.removeAllListeners('active')
    }

    // Reset the state.
    Object.assign(this, ZapGrpc.VOLATILE_STATE)
  }

  /**
   * waitForState - Wait for grpc service to enter specific sate (proxy method).
   *
   * @param {...object} args WaitForState args
   * @returns {object} LndGrpc.waitForState
   */
  waitForState(...args) {
    return proxy(this.grpc.waitForState(args))
  }

  isSubscribed(subscription) {
    return Boolean(this.activeSubscriptions[subscription])
  }

  /**
   * subscribeAll - Subscribe to all gRPC streams.
   */
  async subscribeAll() {
    this.subscribe('invoices', 'transactions', 'backups', 'htlcs')

    // Finalize subscriptions if `data.syncedToChain` is true.
    // Returns true if subscriptions were finalized and false otherwise
    const finalizeSubscriptions = async data => {
      if (data && data.syncedToChain) {
        if (this.isSubscribed('info')) {
          await this.unsubscribe('info')
        }
        this.subscribe({ name: 'info', params: { pollInterval: 60000 } })
        this.subscribeChannelGraph()
        return true
      }
      return false
    }

    const data = await this.services.Lightning.getInfo()

    // If we are already fully synced set up finalize the subscriptions right away.
    if (!(await finalizeSubscriptions(data))) {
      // Otherwise, set up a fast poling subscription to the info stream and finalize once the chain sync has completed.
      // This is needed because LND chanRouter waits for chain sync to complete before accepting subscriptions.

      this.subscribe({ name: 'info', params: { pollImmediately: true } })
      this.on('subscribeGetInfo.data', finalizeSubscriptions)
    }
  }

  /**
   * subscribe - Subscribe Subscribe to gRPC streams (``@streams` must be a subset of `this.availableSubscriptions`).
   *
   * @param {...string|object} streams optional list of streams to subscribe to. if omitted, uses all available streams
   * if `stream` is to be called with params array element must be of {name, params} format
   */
  subscribe(...streams) {
    // some of the streams may have params
    // create a map <streamName, params> out of them
    const getSubscriptionParams = items => {
      if (!(items && items.length)) {
        return {}
      }
      return items.reduce((acc, next) => {
        if (isObject(next)) {
          acc[next.name] = next.params
        }
        return acc
      }, {})
    }

    // flattens @streams into an Array<string> of stream names to subscribe to
    const getSubscriptionsNames = items =>
      items && items.map(entry => (isObject(entry) ? entry.name : entry))

    // make sure we are subscribing to known streams if a specific list is provided
    const allSubKeys = Object.keys(this.availableSubscriptions)

    const params = getSubscriptionParams(streams)
    const subNames = getSubscriptionsNames(streams)
    const activeSubKeys =
      subNames && subNames.length ? intersection(allSubKeys, subNames) : allSubKeys

    if (!activeSubKeys.length) {
      return
    }

    grpcLog.info(`Subscribing to gRPC streams: %o`, activeSubKeys)

    // Close and clear subscriptions when they emit an end event.
    activeSubKeys.forEach(key => {
      if (this.isSubscribed(key)) {
        grpcLog.warn(`Unable to subscribe to gRPC streams: %s (already active)`, key)
        return
      }

      // Set up the subscription.
      const { serviceName, methodName } = this.availableSubscriptions[key]
      const service = this.services[serviceName]

      if (!service) {
        grpcLog.warn(
          `Attempt to initialize ${serviceName} has failed. gRPC subscription "${key}" not available.`
        )
        return
      }

      const subscriptionParams = params[key] || {}
      this.activeSubscriptions[key] = service[methodName](subscriptionParams)
      grpcLog.info(`gRPC subscription "${key}" started.`)

      // Setup subscription event forwarders.
      forwardAll(service, methodName, this)

      // Set up subscription event listeners to handle when streams close.
      if (this.activeSubscriptions[key]) {
        this.activeSubscriptions[key].on('end', () => {
          grpcLog.info(`gRPC subscription "${key}" ended.`)
          delete this.activeSubscriptions[key]
        })

        this.activeSubscriptions[key].on('status', callStatus => {
          if (callStatus.code === status.CANCELLED) {
            delete this.activeSubscriptions[key]
            grpcLog.info(`gRPC subscription "${key}" cancelled.`)
          }
        })
      }
    })
  }

  /**
   * unsubscribe - Unsubscribe from all streams. (@streams must be a subset of `this.availableSubscriptions`).
   *
   * @param {...string} streams optional list of streams to unsubscribe from. if omitted, uses all active streams.
   */
  async unsubscribe(...streams) {
    // make sure we are unsubscribing from active services if a specific list is provided
    const allSubKeys = Object.keys(this.activeSubscriptions)
    const activeSubKeys = streams && streams.length ? intersection(allSubKeys, streams) : allSubKeys

    if (!activeSubKeys.length) {
      return
    }

    grpcLog.info(`Unsubscribing from gRPC streams: %o`, activeSubKeys)

    const cancellations = activeSubKeys.map(key => this.cancelSubscription(key))
    await Promise.all(cancellations)
  }

  /**
   * registerSubscription - Register a stream.
   * Provide a mapping between a service and a subscription activation helper method.
   *
   * @param {string} key         Key used to identify the subscription.
   * @param {string} serviceName Name of service that provides the subscription.
   * @param {string} methodName  Name of service methods that activates the subscription.
   */
  registerSubscription(key, serviceName, methodName) {
    this.availableSubscriptions[key] = { key, serviceName, methodName }
  }

  /**
   * cancelSubscription - Unsubscribe from a single stream.
   *
   * @param {string} key Name of stream subscription to cancel
   * @returns {Promise} Resolves once stream has been canceled
   */
  async cancelSubscription(key) {
    if (!this.activeSubscriptions[key]) {
      grpcLog.warn(`Unable to unsubscribe from gRPC stream: %s (not active)`, key)
      return null
    }

    grpcLog.info(`Unsubscribing from ${key} gRPC stream`)

    // Remove subscription event forwarders.
    const { serviceName, methodName } = this.availableSubscriptions[key]
    const service = this.services[serviceName]
    unforwardAll(service, methodName)

    // Cancellation status callback handler.
    const result = new Promise(resolve => {
      this.activeSubscriptions[key].on('status', callStatus => {
        if (callStatus.code === status.CANCELLED) {
          delete this.activeSubscriptions[key]
          grpcLog.info(`Unsubscribed from ${key} gRPC stream`)
          resolve()
        }
      })

      this.activeSubscriptions[key].on('end', () => {
        delete this.activeSubscriptions[key]
        grpcLog.info(`Unsubscribed from ${key} gRPC stream`)
        resolve()
      })
    })

    // Initiate cancellation request.
    this.activeSubscriptions[key].cancel()

    // Resolve once we receive confirmation of the call's cancellation.
    return result
  }

  /**
   * getConnectionSettings - Get connection details based on wallet config.
   *
   * @returns {object} Connection settings
   */
  getConnectionSettings() {
    const { id, type, host, cert, macaroon, protoDir } = this.options

    // Don't use macaroons when connecting to the local tmp instance.
    const useMacaroon = this.useMacaroon && id !== 'tmp'

    // If connecting to a local instance, wait for the macaroon file to exist.
    const waitForMacaroon = type === 'local'
    const waitForCert = type === 'local'

    // Convert longs to strings to prevent floating point precidion issues.
    const grpcOptions = {
      longs: String,
      keepCase: false,
    }

    return {
      host,
      cert,
      macaroon,
      waitForMacaroon,
      waitForCert,
      useMacaroon,
      protoDir,
      grpcOptions,
    }
  }

  /**
   * subscribeChannelGraph - Set up subscription to the channel graph stream.
   *
   * There is no guarentee that it is ready yet as it can take time for lnd to start it once chain sync has finished
   * so set up a schedular to keep retrying until it works.
   *
   * @param {number} initialTimeout Length of time to wait until first retry (ms)
   * @param {number} backoff Backoff exponent
   * @param {number} maxTimeout Maximux Length of time to wait until a retry (ms)
   */
  subscribeChannelGraph(initialTimeout = 250, backoff = 2, maxTimeout = 1000 * 60) {
    const initSubscription = async timeout => {
      if (this.grpc.state !== 'active') {
        return
      }

      // If the channel graph subscription fails to start, try again in a bit.
      if (this.activeSubscriptions.channelgraph) {
        this.activeSubscriptions.channelgraph.once('error', async error => {
          if (error.message === 'router not started') {
            grpcLog.warn('Unable to subscribe to channelgraph. Will try again in %sms', timeout)
            await delay(timeout)
            const nextTimeout = Math.min(maxTimeout, timeout * backoff)
            initSubscription(nextTimeout)
          }
        })
      }

      // Set up the subscription.
      this.subscribe('channelgraph')
    }

    initSubscription(initialTimeout)
  }
}

export default ZapGrpc

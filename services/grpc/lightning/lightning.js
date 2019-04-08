import { join } from 'path'
import { credentials, loadPackageDefinition } from '@grpc/grpc-js'
import { load } from '@grpc/proto-loader'
import lndgrpc from 'lnd-grpc'
import { mainLog } from '@zap/utils/log'
import promisifiedCall from '@zap/utils/promisifiedCall'
import validateHost from '@zap/utils/validateHost'
import waitForFile from '@zap/utils/waitForFile'
import grpcOptions from '@zap/utils/grpcOptions'
import getDeadline from '@zap/utils/getDeadline'
import createSslCreds from '@zap/utils/createSslCreds'
import createMacaroonCreds from '@zap/utils/createMacaroonCreds'
import grpcSslCipherSuites from '@zap/utils/grpcSslCipherSuites'
import LndGrpcService from '@zap/services/grpc/grpcService'
import subscriptions from './lightning.subscriptions'
import methods from './lightning.methods'

/**
 * Creates an LND grpc client lightning service.
 * @returns {Lightning}
 */
class Lightning extends LndGrpcService {
  constructor() {
    super()
    this.serviceName = 'Lightning'
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

    // Set up SSL with the cypher suits that we need.
    process.env.GRPC_SSL_CIPHER_SUITES = grpcSslCipherSuites

    // Get connection params from config.
    const { host, macaroon, type, protoPath } = this.lndConfig

    // Verify that the host is valid before creating a gRPC client that is connected to it.
    await validateHost(host)
    // If we are trying to connect to the internal lnd, wait up to 20 seconds for the macaroon to be generated.
    if (type === 'local') {
      await waitForFile(macaroon, 20000)
    }

    await this.establishConnection()

    // Once connected, make a call to getInfo in order to determine the api version.
    const { service } = this
    const info = await this.getInfo()

    mainLog.info('Connected to Lightning gRPC:', info)

    // Determine most relevant proto version and reconnect using the right rpc.proto if we need to.
    const [closestProtoVersion, latestProtoVersion] = await Promise.all([
      lndgrpc.getClosestProtoVersion(info.version, { path: protoPath }),
      lndgrpc.getLatestProtoVersion({ path: protoPath }),
    ])

    if (closestProtoVersion !== latestProtoVersion) {
      mainLog.info(
        'Found better match. Reconnecting using rpc.proto version: %s',
        closestProtoVersion
      )
      service.close()
      return this.establishConnection(closestProtoVersion)
    }

    return Promise.resolve()
  }

  /**
   * Subscribe to streams after successfully connecting.
   */
  onAfterConnect() {
    this.subscribe()
  }

  /**
   * Discomnnect the gRPC service.
   */
  onBeforeDisconnect() {
    this.unsubscribe()
    super.onBeforeDisconnect()
  }

  // ------------------------------------
  // Helpers
  // ------------------------------------

  /**
   * Establish a connection to the Lightning interface.
   */
  async establishConnection(version) {
    const { host, cert, macaroon, protoPath } = this.lndConfig

    // Find the rpc.proto file to use. If no version was supplied, attempt to use the latest version.
    const versionToUse = version || (await lndgrpc.getLatestProtoVersion({ path: protoPath }))
    const filepath = join(protoPath, `${versionToUse}.proto`)
    mainLog.info('Establishing gRPC connection with proto file %s', filepath)

    // Load gRPC package definition as a gRPC object hierarchy.
    const packageDefinition = await load(filepath, grpcOptions)
    const rpc = loadPackageDefinition(packageDefinition)

    // Create ssl and macaroon credentials to use with the gRPC client.
    const [sslCreds, macaroonCreds] = await Promise.all([
      createSslCreds(cert),
      createMacaroonCreds(macaroon),
    ])
    const creds = credentials.combineChannelCredentials(sslCreds, macaroonCreds)

    // Create a new gRPC client instance.
    this.service = new rpc.lnrpc.Lightning(host, creds)
    try {
      // Wait up to 20 seconds for the gRPC connection to be established.
      return await promisifiedCall(this.service, this.service.waitForReady, getDeadline(20))
    } catch (e) {
      mainLog.warn(e)
      this.service.close()
      return Promise.reject(e)
    }
  }

  /**
   * Subscribe to all bi-directional streams.
   */
  subscribe() {
    mainLog.info('Subscribing to Lightning gRPC streams')
    this.subscriptions['channelGraph'] = this.subscribeChannelGraph()
    this.subscriptions['invoices'] = this.subscribeInvoices()
    this.subscriptions['transactions'] = this.subscribeTransactions()
  }

  /**
   * Unsubscribe from all bi-directional streams.
   */
  unsubscribe() {
    mainLog.info('Unsubscribing from Lightning gRPC streams')
    Object.keys(this.subscriptions).forEach(subscription => {
      if (this.subscriptions[subscription]) {
        mainLog.info(` > Unsubscribing from ${subscription} stream`)
        this.subscriptions[subscription].cancel()
      }
    })
  }
}

Object.assign(Lightning.prototype, subscriptions)
Object.assign(Lightning.prototype, methods)

export default Lightning

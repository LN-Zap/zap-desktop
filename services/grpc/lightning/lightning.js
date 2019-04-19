import { grpcLog } from '@zap/utils/log'
import lndgrpc from 'lnd-grpc'
import LndGrpcService from '@zap/services/grpc/grpcService'
import subscriptions from './lightning.subscriptions'
import methods from './lightning.methods'

/**
 * Creates an LND grpc client Lightning service.
 * @returns {Lightning}
 */
class Lightning extends LndGrpcService {
  constructor(lndConfig) {
    super('Lightning', lndConfig)
  }

  // ------------------------------------
  // FSM Observers
  // ------------------------------------

  /**
   * Reconnect using closest rpc.proto file match.
   */
  async onBeforeActivate() {
    // Once connected, make a call to getInfo in order to determine the api version.
    const { protoPath } = this.lndConfig
    const info = await this.getInfo()
    grpcLog.info('Connected to Lightning gRPC:', info)

    // Determine most relevant proto version and reconnect using the right rpc.proto if we need to.
    const [closestProtoVersion, latestProtoVersion] = await Promise.all([
      lndgrpc.getClosestProtoVersion(info.version, { path: protoPath }),
      lndgrpc.getLatestProtoVersion({ path: protoPath }),
    ])

    if (closestProtoVersion !== latestProtoVersion) {
      grpcLog.info(
        'Found better match. Reconnecting using rpc.proto version: %s',
        closestProtoVersion
      )
      this.service.close()
      await this.establishConnection(closestProtoVersion)
    }

    return super.onBeforeActivate()
  }

  // ------------------------------------
  // Helpers
  // ------------------------------------

  /**
   * Subscribe to all bi-directional streams.
   */
  subscribe() {
    grpcLog.info('Subscribing to Lightning gRPC streams')
    this.subscriptions['channelGraph'] = this.subscribeChannelGraph()
    this.subscriptions['invoices'] = this.subscribeInvoices()
    this.subscriptions['transactions'] = this.subscribeTransactions()
  }
}

Object.assign(Lightning.prototype, subscriptions)
Object.assign(Lightning.prototype, methods)

export default Lightning

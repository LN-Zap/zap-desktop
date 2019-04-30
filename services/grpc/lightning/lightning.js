import { grpcLog } from '@zap/utils/log'
import lndgrpc from 'lnd-grpc'
import GrpcService from '@zap/services/grpc/grpcService'
import subscriptions from './lightning.subscriptions'
import methods from './lightning.methods'

/**
 * Lightning service controller.
 * @extends GrpcService
 */
class Lightning extends GrpcService {
  constructor(lndConfig) {
    super('Lightning', lndConfig)
  }

  // ------------------------------------
  // FSM Observers
  // ------------------------------------

  /**
   * Reconnect using closest rpc.proto file match.
   */
  async onBeforeConnect() {
    // Establish a connection.
    const { useMacaroon, waitForMacaroon } = this._getConnectionSettings()
    await this.establishConnection({ useMacaroon, waitForMacaroon })

    // Once connected, make a call to getInfo in order to determine the api version.
    const info = await this.getInfo()
    grpcLog.info('Connected to Lightning gRPC:', info)

    // Determine most relevant proto version and reconnect using the right rpc.proto if we need to.
    const { protoPath } = this.lndConfig
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
      await this.establishConnection({
        version: closestProtoVersion,
        useMacaroon,
        waitForMacaroon,
      })
    }
  }

  onAfterConnect() {
    this.subscriptions['invoices'] = this.subscribeInvoices()
    this.subscriptions['transactions'] = this.subscribeTransactions()
    this.subscriptions['getinfo'] = this.subscribeGetInfo()
    super.subscribe()

    // subscribe to graph updates only after sync is complete
    // this is needed because LND chanRouter waits for chain sync
    // to complete before accepting subscriptions
    this.on('subscribeGetInfo.data', data => {
      const { synced_to_chain } = data
      if (synced_to_chain && !this.subscriptions['channelGraph']) {
        grpcLog.info('subscribeChannelGraph')
        this.subscriptions['channelGraph'] = this.subscribeChannelGraph()
        super.subscribe('channelGraph')
      }
    })

    grpcLog.info(`Connected to ${this.serviceName} gRPC service`)
  }
}

Object.assign(Lightning.prototype, subscriptions)
Object.assign(Lightning.prototype, methods)

export default Lightning

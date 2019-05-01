import GrpcService from '@zap/services/grpc/grpcService'
import { grpcLog } from '@zap/utils/log'
import methods from './walletUnlocker.methods'

/**
 * WalletUnlocker service controller.
 * @extends GrpcService
 */
class WalletUnlocker extends GrpcService {
  constructor(lndConfig) {
    super('WalletUnlocker', lndConfig)
    this.useMacaroon = false
  }

  onAfterConnect() {
    super.subscribe()
    grpcLog.info(`Connected to ${this.serviceName} gRPC service`)
  }
}

Object.assign(WalletUnlocker.prototype, methods)

export default WalletUnlocker

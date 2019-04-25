import GrpcService from '@zap/services/grpc/grpcService'
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
}

Object.assign(WalletUnlocker.prototype, methods)

export default WalletUnlocker

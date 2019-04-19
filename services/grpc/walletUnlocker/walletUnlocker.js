import LndGrpcService from '@zap/services/grpc/grpcService'
import methods from './walletUnlocker.methods'

/**
 * Creates an LND grpc client WalletUnlocker service.
 * @returns {WalletUnlocker}
 */
class WalletUnlocker extends LndGrpcService {
  constructor(lndConfig) {
    super('WalletUnlocker', lndConfig)
    this.useMacaroon = false
  }
}

Object.assign(WalletUnlocker.prototype, methods)

export default WalletUnlocker

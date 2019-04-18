import LndGrpcService from '@zap/services/grpc/grpcService'
import methods from './walletUnlocker.methods'

/**
 * Creates an LND grpc client lightning service.
 * @returns {WalletUnlocker}
 */
class WalletUnlocker extends LndGrpcService {
  constructor() {
    super()
    this.serviceName = 'WalletUnlocker'
  }
}

Object.assign(WalletUnlocker.prototype, methods)

export default WalletUnlocker

import { expose } from 'comlinkjs'
import WalletUnlocker from '@zap/services/grpc/walletUnlocker'

expose(WalletUnlocker, self)

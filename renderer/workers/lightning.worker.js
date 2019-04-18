import { expose } from 'comlinkjs'
import Lightning from '@zap/services/grpc/lightning'

expose(Lightning, self)

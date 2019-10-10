/* eslint-disable no-restricted-globals */

import { expose } from 'comlinkjs'
import ZapGrpc from '@zap/services/grpc/grpc'

expose(ZapGrpc, self)

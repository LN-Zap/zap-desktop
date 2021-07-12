/* eslint-disable  max-classes-per-file */
import { wrap } from 'comlink'

import proxymise from './proxymise'

const Neutrino = wrap(new Worker(`./neutrino.worker.js`))
const ZapGrpc = wrap(new Worker('./grpc.worker.js'))

/**
 * [LightningInstance description]
 */
class NeutrinoInstance {
  constructor() {
    if (!NeutrinoInstance.instance) {
      NeutrinoInstance.instance = new Neutrino()
    }
    return NeutrinoInstance.instance
  }
}

export const neutrino = proxymise(new NeutrinoInstance())

/**
 * [GrpcInstance description]
 */
class GrpcInstance {
  constructor() {
    if (!GrpcInstance.instance) {
      GrpcInstance.instance = new ZapGrpc()
    }
    return GrpcInstance.instance
  }
}

export const grpc = proxymise(new GrpcInstance())

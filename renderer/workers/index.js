import { proxy } from 'comlinkjs'

const Neutrino = proxy(new Worker(`./neutrino.worker.js`))
const Grpc = proxy(new Worker('./grpc.worker.js'))

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
export const neutrinoService = new NeutrinoInstance()

/**
 * [GrpcInstance description]
 */
class GrpcInstance {
  constructor() {
    if (!GrpcInstance.instance) {
      GrpcInstance.instance = new Grpc()
    }
    return GrpcInstance.instance
  }
}
export const grpcService = new GrpcInstance()

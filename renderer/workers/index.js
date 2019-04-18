import { proxy } from 'comlinkjs'

const Neutrino = proxy(new Worker(`./neutrino.worker.js`))
const WalletUnlocker = proxy(new Worker('./walletUnlocker.worker.js'))
const Lightning = proxy(new Worker('./lightning.worker.js'))

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
const neutrinoService = new NeutrinoInstance()
Object.freeze(neutrinoService)

/**
 * [WalletUnlockerInstance description]
 */
class WalletUnlockerInstance {
  constructor() {
    if (!WalletUnlockerInstance.instance) {
      WalletUnlockerInstance.instance = new WalletUnlocker()
    }
    return WalletUnlockerInstance.instance
  }
}
const walletUnlockerService = new WalletUnlockerInstance()
Object.freeze(walletUnlockerService)

/**
 * [LightningInstance description]
 */
class LightningInstance {
  constructor() {
    if (!LightningInstance.instance) {
      LightningInstance.instance = new Lightning()
    }
    return LightningInstance.instance
  }
}
const lightningService = new LightningInstance()
Object.freeze(lightningService)

export { neutrinoService, lightningService, walletUnlockerService }

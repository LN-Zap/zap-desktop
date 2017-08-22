import config from './config'
import lightning from './lib/lightning'
import methods from './methods'

const lnd = lightning(config.lightningRpc, config.lightningHost)

export default (event, msg, data) => methods(lnd, event, msg, data)

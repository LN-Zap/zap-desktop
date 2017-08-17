import config from './config'
import lightning from './lib/lightning'

const lnd = lightning(config.lightningRpc, config.lightningHost)

export function info() {
  return new Promise((resolve, reject) => {
    lnd.getInfo({}, (err, data) => {
      if (err) { reject(err) }
      
      resolve(data)
    })
  })
}

export default {
  info
}
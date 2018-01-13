import grpc from 'grpc'
import fs from 'fs'
import config from './config'
import { lightning } from './lib/lightning'
import subscribe from './subscribe'
import methods from './methods'

export default (callback) => {
  const macaroonFile = fs.readFileSync(config.macaroon)
  const meta = new grpc.Metadata()
  meta.add('macaroon', macaroonFile.toString('hex'))

  const lnd = lightning(config.lightningRpc, config.lightningHost)

  const lndSubscribe = mainWindow => subscribe(mainWindow, lnd, meta)
  const lndMethods = (event, msg, data) => methods(lnd, meta, event, msg, data)
  callback(lndSubscribe, lndMethods)
}

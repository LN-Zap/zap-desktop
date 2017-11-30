import fs from 'fs'
import path from 'path'
import grpc from 'grpc'
import config from '../config'

module.exports = (rpcpath, host) => {
  const lndCert = fs.readFileSync(config.cert)
  const credentials = grpc.credentials.createSsl(lndCert)

  const rpc = grpc.load(path.join(__dirname, 'rpc.proto'))

  return new rpc.lnrpc.Lightning(host, credentials)
}

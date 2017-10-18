import fs from 'fs'
import path from 'path'
import grpc from 'grpc'
import config from '../config'

module.exports = (rpcpath, host) => {
  process.env.GRPC_SSL_CIPHER_SUITES = 'HIGH+ECDSA'
  console.log('RPC PATH: ', path.join(__dirname, 'rpc.proto'))
  const rpc = grpc.load(path.join(__dirname, 'rpc.proto'))

  const lndCert = fs.readFileSync(config.cert)
  const credentials = grpc.credentials.createSsl(lndCert)

  return new rpc.lnrpc.Lightning(host, credentials)
}

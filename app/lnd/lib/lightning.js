import fs from 'fs'
import grpc from 'grpc'
import config from '../config'

module.exports = (path, host) => {
  process.env.GRPC_SSL_CIPHER_SUITES = 'HIGH+ECDSA'

  const rpc = grpc.load(path)

  const lndCert = fs.readFileSync(config.cert)
  const credentials = grpc.credentials.createSsl(lndCert)

  return new rpc.lnrpc.Lightning(host, credentials)
}

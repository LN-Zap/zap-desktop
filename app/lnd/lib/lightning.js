import fs from 'fs'
import grpc from 'grpc'

module.exports = (path, host, cert) => {
  process.env['GRPC_SSL_CIPHER_SUITES'] = 'HIGH+ECDSA'

  const rpc = grpc.load(path)

  const lndCert = fs.readFileSync('/Users/jmow/Library/Application Support/Lnd/tls.cert')
  const credentials = grpc.credentials.createSsl(lndCert)

  return new rpc.lnrpc.Lightning(host, credentials)
}
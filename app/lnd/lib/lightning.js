import fs from 'fs'
import grpc from 'grpc'
import config from '../config'

// Default is ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384
// https://github.com/grpc/grpc/blob/master/doc/environment_variables.md
//
// Current LND cipher suites here:
// https://github.com/lightningnetwork/lnd/blob/master/lnd.go#L80
//
// We order the suites by priority, based on the recommendations provided by SSL Labs here:
// https://github.com/ssllabs/research/wiki/SSL-and-TLS-Deployment-Best-Practices#23-use-secure-cipher-suites
process.env.GRPC_SSL_CIPHER_SUITES =
  process.env.GRPC_SSL_CIPHER_SUITES ||
  [
    'ECDHE-ECDSA-AES128-GCM-SHA256',
    'ECDHE-ECDSA-AES256-GCM-SHA384',
    'ECDHE-ECDSA-AES128-CBC-SHA256',
    'ECDHE-ECDSA-CHACHA20-POLY1305'
  ].join(':')

const lightning = (rpcpath, host) => {
  const lndConfig = config.lnd()
  const lndCert = fs.readFileSync(lndConfig.cert)
  const sslCreds = grpc.credentials.createSsl(lndCert)
  const rpc = grpc.load(lndConfig.lightningRpc)

  const metadata = new grpc.Metadata()
  const macaroonHex = fs.readFileSync(lndConfig.macaroon).toString('hex')
  metadata.add('macaroon', macaroonHex)

  const macaroonCreds = grpc.credentials.createFromMetadataGenerator((params, callback) =>
    callback(null, metadata)
  )
  const credentials = grpc.credentials.combineChannelCredentials(sslCreds, macaroonCreds)

  return new rpc.lnrpc.Lightning(host, credentials)
}

export default lightning

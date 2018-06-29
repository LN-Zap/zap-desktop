import grpc from 'grpc'
import config from '../config'
import { getDeadline, validateHost, createSslCreds, createMacaroonCreds } from './util'

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

/**
 * Creates an LND grpc client lightning service.
 * @returns {rpc.lnrpc.Lightning}
 */
const lightning = async () => {
  const lndConfig = config.lnd()
  const { host, rpcProtoPath, cert, macaroon } = lndConfig

  // Verify that the host is valid before creating a gRPC client that is connected to it.
  return await validateHost(host).then(async () => {
    // Load the gRPC proto file.
    const rpc = grpc.load(rpcProtoPath)

    // Create ssl and macaroon credentials to use with the gRPC client.
    const [sslCreds, macaroonCreds] = await Promise.all([
      createSslCreds(cert),
      createMacaroonCreds(macaroon)
    ])
    const credentials = grpc.credentials.combineChannelCredentials(sslCreds, macaroonCreds)

    // Create a new gRPC client instance.
    const lnd = new rpc.lnrpc.Lightning(host, credentials)

    // Call the getInfo method to ensure that we can make successful calls to the gRPC interface.
    return new Promise((resolve, reject) => {
      lnd.getInfo({}, { deadline: getDeadline(2) }, err => {
        if (err) {
          return reject(err)
        }
        return resolve(lnd)
      })
    })
  })
}

export default lightning

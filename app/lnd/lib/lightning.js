import grpc from 'grpc'
import { loadSync } from '@grpc/proto-loader'
import config from '../config'
import { getDeadline, validateHost, createSslCreds, createMacaroonCreds } from './util'

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
    // The following options object closely approximates the existing behavior of grpc.load.
    // See https://github.com/grpc/grpc-node/blob/master/packages/grpc-protobufjs/README.md
    const options = {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true
    }
    const packageDefinition = loadSync(rpcProtoPath, options)

    // Load gRPC package definition as a gRPC object hierarchy.
    const rpc = grpc.loadPackageDefinition(packageDefinition)

    // Create ssl and macaroon credentials to use with the gRPC client.
    const [sslCreds, macaroonCreds] = await Promise.all([
      createSslCreds(cert),
      createMacaroonCreds(macaroon)
    ])
    const credentials = grpc.credentials.combineChannelCredentials(sslCreds, macaroonCreds)

    // Instantiate a new connection to the Lightning interface.
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

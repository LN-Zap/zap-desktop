import grpc from 'grpc'
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

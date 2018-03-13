import fs from 'fs'
import path from 'path'
import grpc from 'grpc'
import config from '../config'

const grpcInit = (rpcpath, host) => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
  process.env.GRPC_SSL_CIPHER_SUITES = 'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-ECDSA-AES256-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384'
  
  const lndCert = fs.readFileSync(config.cert)
  const credentials = grpc.credentials.createSsl(lndCert)
  const rpc = grpc.load(path.join(__dirname, 'rpc.proto'))


  const lightning = new rpc.lnrpc.Lightning(host, credentials)
  const walletUnlocker = new rpc.lnrpc.WalletUnlocker(host, credentials)

  return {
    lightning,
    walletUnlocker
  }
}

export default grpcInit

import fs from 'fs'
import grpc from 'grpc'
import config from '../config'

const walletUnlocker = (rpcpath, host) => {
  const lndConfig = config.lnd()
  const lndCert = fs.readFileSync(lndConfig.cert)
  const credentials = grpc.credentials.createSsl(lndCert)
  const rpc = grpc.load(lndConfig.rpcProtoPath)

  return new rpc.lnrpc.WalletUnlocker(host, credentials)
}

export default walletUnlocker

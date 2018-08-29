import fs from 'fs'
import grpc from 'grpc'
import { loadSync } from '@grpc/proto-loader'
import walletUnlockerMethods from './walletUnlockerMethods'
import { mainLog } from '../utils/log'

export const initWalletUnlocker = lndConfig => {
  const walletUnlockerObj = walletUnlocker(lndConfig)
  const walletUnlockerMethodsCallback = (event, msg, data) =>
    walletUnlockerMethods(lndConfig, walletUnlockerObj, mainLog, event, msg, data)

  return walletUnlockerMethodsCallback
}

export const walletUnlocker = lndConfig => {
  const lndCert = fs.readFileSync(lndConfig.cert)
  const credentials = grpc.credentials.createSsl(lndCert)

  // Load the gRPC proto file.
  // The following options object closely approximates the existing behavior of grpc.load
  // See https://github.com/grpc/grpc-node/blob/master/packages/grpc-protobufjs/README.md
  const options = {
    keepCase: true,
    longs: Number,
    enums: String,
    defaults: true,
    oneofs: true
  }
  const packageDefinition = loadSync(lndConfig.rpcProtoPath, options)

  // Load gRPC package definition as a gRPC object hierarchy.
  const rpc = grpc.loadPackageDefinition(packageDefinition)

  // Instantiate a new connection to the WalletUnlocker interface.
  return new rpc.lnrpc.WalletUnlocker(lndConfig.host, credentials)
}

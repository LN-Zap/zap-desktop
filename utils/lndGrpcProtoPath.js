import { dirname, join } from 'path'
import isDev from 'electron-is-dev'
import appRootPath from '@zap/utils/appRootPath'

/**
 * Get the OS specific path to the rpc.proto files that are provided by lnd-grpc.
 * @return {String} Path to the rpc.proto files.
 */
const lndGrpcProtoPath = () => {
  return isDev
    ? join(dirname(require.resolve('lnd-grpc/package.json')), 'proto', 'lnrpc')
    : join(appRootPath(), 'resources', 'proto', 'lnrpc')
}

export default lndGrpcProtoPath

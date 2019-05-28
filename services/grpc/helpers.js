import { grpcLog } from '@zap/utils/log'

/**
 * Logs a service method invocation.
 */
export function logGrpcCmd(method, payload) {
  grpcLog.info(`Calling ${method} with payload: %o`, payload)
}

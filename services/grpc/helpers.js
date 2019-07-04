import { grpcLog } from '@zap/utils/log'

/**
 * logGrpcCmd - Logs a service method invocation.
 *
 * @param {string} method Name of method to log
 * @param {any} payload Payload of method to log
 */
export function logGrpcCmd(method, payload) {
  grpcLog.info(`Calling ${method} with payload: %o`, payload)
}

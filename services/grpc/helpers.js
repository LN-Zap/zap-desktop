import { grpcLog } from '@zap/utils/log'

/**
 * Setup listener that re-emits specified event.
 */
export function forwardEvent(service, event, target) {
  service.on(event, data => target.emit(event, data))
}

/**
 * Forwards `data` and `error` events of the specified `base` subscription.
 */
export function forwardAll(service, baseEvent, target) {
  forwardEvent(service, `${baseEvent}.data`, target)
  forwardEvent(service, `${baseEvent}.error`, target)
}

/**
 * Logs a service method invocation.
 */
export function logGrpcCmd(service, method, payload) {
  grpcLog.info(`Calling Lightning.getInfo with payload: %o`, payload)
}

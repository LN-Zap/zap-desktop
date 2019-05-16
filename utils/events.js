import { grpcLog } from './log'

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
 * Unforwards `data` and `error` events of the specified `base` subscription.
 */
export function unforwardAll(service, baseEvent) {
  service.removeAllListeners(`${baseEvent}.data`)
  service.removeAllListeners(`${baseEvent}.error`)
}

/**
 * Logs a service method invocation.
 */
export function logGrpcCmd(method, payload) {
  grpcLog.info(`Calling ${method} with payload: %o`, payload)
}

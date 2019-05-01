import createScheduler from '@zap/utils/scheduler'
import isEqual from 'lodash.isequal'
import EventEmitter from 'events'
import { grpcLog } from '@zap/utils/log'

/**
 * Creates polling stream for the specified LND command
 * streamify must be called in a `EventEmitter` context, meaning `this.emit` should exist.
 * e.g streamify.call(this,{...})
 * @export
 * @param {Object} streamDefinition - stream params
 * @param {function} streamDefinition.command - `grpc` command,
 * @param {string} streamDefinition.dataEventName - event name to that it used to dispatch `data` event,
 * @param {string} streamDefinition.errorEventName - event name to that it used to dispatch `error` event,
 * @param {number} streamDefinition.pollInterval - how frequent to execute `command`,
 * @param {boolean} streamDefinition.cancelOnError - if `cancel` should be called when `command` throws an exception,
 * @returns {Object} - returns stream-like object that has `on` and `cancel` methods
 */
export default function streamify({
  command,
  dataEventName,
  errorEventName,
  pollInterval,
  cancelOnError,
}) {
  // internal emitter to create stream-like behavior
  const emitter = new EventEmitter()
  const scheduler = createScheduler()

  const cancel = () => {
    scheduler.removeAllTasks()
    emitter.emit('end')
  }

  let prevResult = null
  const task = async () => {
    try {
      const result = await command()
      // only dispatch update if we got new results
      if (!isEqual(result, prevResult)) {
        prevResult = result
        this.emit(dataEventName, result)
        emitter.emit(errorEventName, result)
      }
    } catch (e) {
      grpcLog.info(e)
      this.emit(errorEventName, e)
      emitter.emit(errorEventName, e)
      if (cancelOnError) {
        cancel()
      }
    }
  }

  scheduler.addTask({ task, baseDelay: pollInterval })

  return {
    on: emitter.on.bind(emitter),
    cancel,
  }
}

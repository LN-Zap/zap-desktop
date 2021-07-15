import EventEmitter from 'events'

import isEqual from 'lodash/isEqual'

import createScheduler from '@zap/utils/scheduler'

/**
 * streamify - Creates polling stream for the specified routine.
 *
 *
 * @param {*} streamDefinition - stream params
 * @param {Function} streamDefinition.command - polling function,
 * @param {string} streamDefinition.dataEventName - event name to that it used to dispatch `data` event,
 * @param {string} streamDefinition.errorEventName - event name to that it used to dispatch `error` event,
 * @param {number} streamDefinition.pollInterval - how frequent to execute `command`,
 * @param {number} streamDefinition.pollImmediately - execute `command` immediately after stream construction,
 * @param {boolean} streamDefinition.cancelOnError - if `cancel` should be called when `command` throws an exception,
 * @returns {*} - returns stream-like object that has `on` and `cancel` methods
 */
export default function streamify({
  command,
  dataEventName,
  errorEventName,
  pollInterval,
  pollImmediately,
  cancelOnError,
}) {
  // internal emitter to create stream-like behavior
  const emitter = new EventEmitter()
  const scheduler = createScheduler()

  emitter.cancel = () => {
    scheduler.removeAllTasks()
    emitter.emit('end')
  }

  let prevResult = null
  const task = async () => {
    try {
      const result = await command()
      // only dispatch update if we got new results
      if (prevResult && !isEqual(result, prevResult)) {
        emitter.emit(dataEventName, result)
      }
      prevResult = result
    } catch (e) {
      emitter.emit(errorEventName, e)
      if (cancelOnError) {
        emitter.cancel()
      }
    }
  }

  scheduler.addTask({ task, baseDelay: pollInterval, runImmediately: pollImmediately })

  return emitter
}

/**
 * forwardEvent - Setup listener that re-emits specified event.
 *
 * @param {object} source Soure event emitter
 * @param {Event} event Event to forward
 * @param {object} target Target event emitter
 */
export function forwardEvent(source, event, target) {
  source.on(event, data => target.emit(event, data))
}

/**
 * forwardAll - Forwards `data` and `error` events of the specified `base` event.
 *
 * @param {object} source Soure event emitter
 * @param {string} baseEvent Base name of evens to forward
 * @param {object} target Target event emitter
 */
export function forwardAll(source, baseEvent, target) {
  forwardEvent(source, `${baseEvent}.data`, target)
  forwardEvent(source, `${baseEvent}.error`, target)
}

/**
 * unforwardAll - Unforwards `data` and `error` events of the specified `base` subscription.
 *
 * @param {object} source Soure event emitter
 * @param {string} baseEvent Base name of events to stop forwarding
 */
export function unforwardAll(source, baseEvent) {
  source.removeAllListeners(`${baseEvent}.data`)
  source.removeAllListeners(`${baseEvent}.error`)
}

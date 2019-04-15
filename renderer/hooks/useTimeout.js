import { useEffect, useRef } from 'react'

/**
 * Timeout callback
 *
 * @callback intervalCallback
 */

/**
 * @export
 * @callback
 * @param {?number} delay timeout delay. Pass null to pause
 * @param {intervalCallback} callback A callback to run
 */
export default function useTimeout(callback, delay) {
  const savedCallback = useRef()

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the timeout.
  useEffect(() => {
    function tick() {
      savedCallback.current()
    }
    if (delay !== null) {
      const id = setTimeout(tick, delay)
      return () => clearTimeout(id)
    }
  }, [delay])
}

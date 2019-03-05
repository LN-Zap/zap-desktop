import { useEffect, useRef } from 'react'

/**
 * Interval callback
 *
 * @callback intervalCallback
 */

/**
 * @export
 * @callback
 * @param {?number} delay interval delay. Pass null to pause
 * @param {intervalCallback} callback A callback to run
 */
export default function useInterval(callback, delay) {
  const savedCallback = useRef()

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  })

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current()
    }
    if (delay !== null) {
      const id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}

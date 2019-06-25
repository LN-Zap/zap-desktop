import { useEffect, useRef } from 'react'

/**
 * useTimeout - React hook that triggers @callback after @delay timout.
 *
 * @param {Function} callback Callback to run after timeout
 * @param {[number]} delay Delay. Pass null to pause
 */
export default function useTimeout(callback, delay) {
  const savedCallback = useRef()

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the timeout.
  useEffect(() => {
    const tick = () => {
      savedCallback.current()
    }
    if (delay !== null) {
      const id = setTimeout(tick, delay)
      return () => clearTimeout(id)
    }
  }, [delay])
}

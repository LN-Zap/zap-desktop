import { useEffect } from 'react'

/**
 * isInside - Check if an event comes from a nested element.
 *
 * @param  {object} ref Element reference
 * @returns {boolean} Boolean indicating whether event originates from nested element
 */
function isInside(ref) {
  return !ref.current || ref.current.contains(this.target)
}

/**
 * useOnClickOutside - React hook that calls a handler when a click event comes from outside of a ref.
 *
 * @param  {[object]|object} refOrRefList Element reference or list of element references
 * @param  {Function} handler Handler
 */
export default function useOnClickOutside(refOrRefList, handler) {
  const refList = Array.from(refOrRefList)

  useEffect(() => {
    const listener = event => {
      // Do nothing if clicking ref's element or descendent elements
      if (refList.some(isInside, event)) {
        return
      }
      handler(event)
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [refOrRefList, handler, refList])
}

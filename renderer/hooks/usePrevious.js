import { useEffect, useRef } from 'react'

/**
 * usePrevious - Caches specified value. This hooks is used to store previous prop
 * value so it can be compared against the most recent one.
 *
 * @exports
 * @param {*} value next value
 * @returns {*} currently stored value
 */
export default function usePrevious(value) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

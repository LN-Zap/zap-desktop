import { useEffect, useRef } from 'react'

import debounce from 'lodash/debounce'

/**
 * useDebounce - React hook that calls a debounced version of a @func when @value is changed.
 *
 * @param {Function} func Function to debounce
 * @param {any} value Value to call function with
 * @param {[number]} timeout Timeout
 */
export default function useDebounce(func, value, timeout = 300) {
  const debouncedFunc = useRef(debounce(func, timeout))

  useEffect(() => {
    debouncedFunc.current(value)
  }, [value])
}

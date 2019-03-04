import debounce from 'lodash.debounce'
import { useEffect, useRef } from 'react'

/**
 * React hook that calls a debounced version of a @func when @value is changed.
 */
export default function useDebounce(func, value, timeout = 300) {
  const debouncedFunc = useRef(debounce(func, timeout))

  useEffect(() => {
    debouncedFunc.current(value)
  }, [value])
}

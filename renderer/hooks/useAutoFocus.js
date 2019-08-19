import { useLayoutEffect } from 'react'

/**
 * maybeFocusRef - Focus an element.
 *
 * @param  {object} ref Element reference
 */
function maybeFocusRef(ref) {
  if (ref.current && document.activeElement !== ref.current) {
    ref.current.focus()
  }
}

/**
 * useAutoFocus - React hook that calls a handler when a click event comes from outside of a ref.
 *
 * @param  {object} ref Element reference
 * @param  {boolean} willAutoFocus Boolean indicating whether element should autofocus.
 */
export default function useAutoFocus(ref, willAutoFocus) {
  useLayoutEffect(() => {
    willAutoFocus && maybeFocusRef(ref)
  }, [ref, willAutoFocus])
}

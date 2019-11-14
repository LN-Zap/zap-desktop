import { useEffect } from 'react'

/**
 * useOnKeydown - React hook that triggers @action when @key is pressed.
 *
 * @param {string} key Key pressed
 * @param {Function} action Action to perform on keydown
 * @param {boolean} preventDefault Whether event default should be prevented when hook triggers `action`
 */
export default function useOnKeydown(key, action, preventDefault = false) {
  const onKeyDown = e => {
    if (e.key === key && action) {
      preventDefault && e.preventDefault()
      action()
    }
  }
  useEffect(() => {
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  })
}

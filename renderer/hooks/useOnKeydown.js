import { useEffect } from 'react'

/**
 * useOnKeydown - React hook that triggers @action when @key is pressed.
 *
 * @param {string} key Key pressed
 * @param {Function} action Action to perform on keydown
 */
export default function useOnKeydown(key, action) {
  const onKeyDown = e => {
    if (e.key === key && action) {
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

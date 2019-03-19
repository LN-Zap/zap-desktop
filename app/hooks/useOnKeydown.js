import { useEffect } from 'react'
/**
 * React hook that triggers @action when @key is pressed
 */
export default function useOnKeydown(key, action) {
  function onKeyDown(e) {
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

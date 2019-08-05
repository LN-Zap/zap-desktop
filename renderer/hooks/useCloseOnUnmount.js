import { useEffect, useRef } from 'react'

/**
 * useCloseOnUnmount - React hook to be used with modals and dialog boxes.
 * This is useful to ensure dialog is always closed even in case unmounted together with parent.
 *
 * @param {Function} onClose Modal onClose method to call when the component unmounts
 */
export default function useCloseOnUnmount(onClose) {
  const savedCallback = useRef()

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = onClose
  })

  useEffect(() => {
    return () => {
      savedCallback.current()
    }
  }, [])
}

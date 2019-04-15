import { useEffect, useRef } from 'react'
/**
 * React hook to be used with modals and dialog boxes
 * calls @onClose  when the component unmounts
 * This is useful to ensure dialog is always closed even in case unmounted together with parent
 */
export default function useCloseOnUnmount(isOpen, onClose) {
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

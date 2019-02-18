import { useEffect } from 'react'
/**
 * React hook to be used with modals and dialog boxes
 * calls @onClose  when the component unmounts
 * This is useful to ensure dialog is always closed even in case unmounted together with parent
 */
export default function useCloseOnUnmount(isOpen, onClose) {
  useEffect(() => {
    return () => {
      !isOpen && onClose()
    }
  }, [])
}

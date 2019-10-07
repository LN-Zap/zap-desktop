import { useEffect } from 'react'

/**
 * useFormError - Sets form error with informed form and calls `clearError` afterwards
 * to clean redux state.
 *
 * @param {string} error login error object compatible with informed api
 * @param {Function} clearError action to call after error is set
 * @param {object} formApi React ref that references informed form api
 */
export default function useFormError(error, clearError, formApi) {
  useEffect(() => {
    const { current } = formApi || {}
    if (error && current) {
      current.setFormError(error)
      clearError && clearError()
    }
  }, [error, clearError, formApi])
}

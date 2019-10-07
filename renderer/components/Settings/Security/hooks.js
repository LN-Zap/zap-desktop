import { useEffect } from 'react'

/**
 * useLoginError - Sets loginError with informed form and calls `clearLoginError` afterwards
 * to clean redux state.
 *
 * @param {string} loginError login error object compatible with informed api
 * @param {string} clearLoginError action to call after error is set
 * @param {object} formApi React ref that references informed form api
 */

export const useLoginError = (loginError, clearLoginError, formApi) => {
  useEffect(() => {
    const { current } = formApi || {}
    if (loginError && current) {
      current.setFormError(loginError)
      clearLoginError()
    }
  }, [loginError, clearLoginError, formApi])
}

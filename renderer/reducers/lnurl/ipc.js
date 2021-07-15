import { getIntl } from '@zap/i18n'
import { showNotification, showError, updateNotification } from 'reducers/notification'

import messages from './messages'
import { setLnurlAuthParams, setLnurlChannelParams, setLnurlWithdrawParams } from './reducer'

/**
 * lnurlError - IPC handler for lnurlError event.
 *
 * @param {event} event Event ipc event
 * @param {object} data Data
 * @param {string} data.message message
 * @returns {(dispatch:Function) => void} Thunk
 */
export const lnurlError = (event, { message }) => dispatch => {
  dispatch(showError(message))
}

// ------------------------------------
// lnurl-auth
// ------------------------------------

/**
 * lnurlAuthRequest - IPC handler for lnurlAuthRequest event.
 *
 * @param {event} event Event ipc event
 * @param {object} params { service }
 * @param {string} params.service lnurl auth uri
 * @param {string} params.secret lnurl k1 secret
 * @returns {(dispatch:Function) => void} Thunk
 */
export const lnurlAuthRequest = (event, { service, secret }) => dispatch => {
  dispatch(setLnurlAuthParams({ service, secret }))
}

/**
 * lnurlAuthSuccess - IPC handler for lnurlAuthSuccess event.
 *
 * @param {event} event Event ipc event
 * @param {object} params { service }
 * @param {string} params.service lnurl auth uri
 * @returns {(dispatch:Function) => void} Thunk
 */
export const lnurlAuthSuccess = (event, { service }) => dispatch => {
  const intl = getIntl()
  dispatch(showNotification(intl.formatMessage(messages.lnurl_auth_success, { service })))
}

/**
 * lnurlAuthError - IPC handler for lnurlAuthError event.
 *
 * @param {event} event Event ipc event
 * @param {object} params { service, reason }
 * @param {string} params.service lnurl auth uri
 * @param {string} params.reason error reason
 * @returns {(dispatch:Function) => void} Thunk
 */
export const lnurlAuthError = (event, { service, reason }) => dispatch => {
  const intl = getIntl()
  dispatch(showError(intl.formatMessage(messages.lnurl_auth_error, { service, reason })))
}

// ------------------------------------
// lnurl-channel
// ------------------------------------

/**
 * lnurlChannelRequest - IPC handler for lnurlChannelRequest event.
 *
 * @param {event} event Event ipc event
 * @param {object} params { service }
 * @param {string} params.service lnurl channel uri
 * @returns {(dispatch:Function) => void} Thunk
 */
export const lnurlChannelRequest = (event, { service }) => dispatch => {
  dispatch(setLnurlChannelParams({ service }))
}

/**
 * lnurlChannelSuccess - IPC handler for lnurlChannelSuccess event.
 *
 * @param {event} event Event ipc event
 * @param {object} params { service }
 * @param {string} params.service lnurl channel uri
 * @returns {(dispatch:Function) => void} Thunk
 */
export const lnurlChannelSuccess = (event, { service }) => dispatch => {
  const intl = getIntl()
  dispatch(
    updateNotification(
      { payload: { service } },
      {
        variant: 'success',
        message: intl.formatMessage(messages.lnurl_channel_success, { service }),
        timeout: 3000,
        isProcessing: false,
      }
    )
  )
}

/**
 * lnurlChannelError - IPC handler for lnurlChannelError event.
 *
 * @param {event} event Event ipc event
 * @param {object} params { service, reason }
 * @param {string} params.service lnurl channel uri
 * @param {string} params.reason error reason
 * @returns {(dispatch:Function) => void} Thunk
 */
export const lnurlChannelError = (event, { service, reason }) => dispatch => {
  const intl = getIntl()
  dispatch(
    updateNotification(
      { payload: { service } },
      {
        variant: 'error',
        message: intl.formatMessage(messages.lnurl_channel_error, { service, reason }),
        isProcessing: false,
      }
    )
  )
}

// ------------------------------------
// lnurl-withdraw
// ------------------------------------

/**
 * lnurlWithdrawSuccess - IPC handler for lnurlWithdrawSuccess event.
 *
 * @param {event} event Event ipc event
 * @param {object} params { service }
 * @param {string} params.service service
 * @returns {(dispatch:Function) => void} Thunk
 */
export const lnurlWithdrawSuccess = (event, { service }) => dispatch => {
  const intl = getIntl()
  dispatch(
    updateNotification(
      { payload: { service } },
      {
        variant: 'success',
        message: intl.formatMessage(messages.lnurl_withdraw_success, { service }),
        timeout: 3000,
        isProcessing: false,
      }
    )
  )
}

/**
 * lnurlWithdrawError - IPC handler for lnurlWithdrawError event.
 *
 * @param {event} event Event ipc event
 * @param {object} params { service, reason }
 * @param {string} params.service lnurl
 * @param {string} params.reason error reason
 * @returns {(dispatch:Function) => void} Thunk
 */
export const lnurlWithdrawError = (event, { service, reason }) => dispatch => {
  const intl = getIntl()
  dispatch(
    updateNotification(
      { payload: { service } },
      {
        variant: 'error',
        message: intl.formatMessage(messages.lnurl_withdraw_error, { service, reason }),
        isProcessing: false,
      }
    )
  )
}

/**
 * lnurlWithdrawRequest - IPC handler for lnurlWithdrawRequest event.
 *
 * @param {event} event Event ipc event
 * @param {object} params { service, amount, memo }
 * @param {string} params.service lnurl
 * @param {number} params.amount ln pr amount
 * @param {string} params.memo ln pr memo
 * @returns {(dispatch:Function) => void} Thunk
 */
export const lnurlWithdrawRequest = (event, { service, amount, memo }) => dispatch => {
  dispatch(setLnurlWithdrawParams({ amount, service, memo }))
}

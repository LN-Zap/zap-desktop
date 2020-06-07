import { getIntl } from '@zap/i18n'
import { showNotification, showError, updateNotification } from 'reducers/notification'
import { setLnurlAuthParams, setLnurlChannelParams } from './reducer'
import messages from './messages'

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

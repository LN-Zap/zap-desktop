import { getIntl } from '@zap/i18n'
import { updateNotification } from 'reducers/notification'
import { setLnurlChannelParams } from './reducer'
import messages from './messages'

// ------------------------------------
// IPC
// ------------------------------------

/**
 * lnurlChannelRequest - IPC handler for lnurlChannelRequest event.
 *
 * @param {event} event Event ipc event
 * @param {object} params { service, amount, memo }
 * @param {string} params.service lnurl
 * @param {number} params.uri ln channel uri
 * @returns {(dispatch:Function) => void} Thunk
 */
export const lnurlChannelRequest = (event, { service, uri }) => dispatch => {
  dispatch(setLnurlChannelParams({ service, uri }))
}

/**
 * lnurlChannelSuccess - IPC handler for lnurlChannelSuccess event.
 *
 * @param {event} event Event ipc event
 * @param {object} params { uri }
 * @param {string} params.uri uri
 * @returns {(dispatch:Function) => void} Thunk
 */
export const lnurlChannelSuccess = (event, { uri }) => dispatch => {
  const intl = getIntl()
  // dispatch(showNotification(intl.formatMessage(messages.channels_lnurl_channel_success, { uri })))

  dispatch(
    updateNotification(
      { payload: { uri } },
      {
        variant: 'success',
        message: intl.formatMessage(messages.channels_lnurl_channel_success, { uri }),
        isProcessing: false,
      }
    )
  )
}

/**
 * lnurlChannelError - IPC handler for lnurlChannelError event.
 *
 * @param {event} event Event ipc event
 * @param {object} params { uri, reason }
 * @param {string} params.uri uri
 * @param {string} params.reason error reason
 * @returns {(dispatch:Function) => void} Thunk
 */
export const lnurlChannelError = (event, { uri, reason }) => dispatch => {
  const intl = getIntl()
  // dispatch(showError(intl.formatMessage(messages.channels_lnurl_channel_error, { uri, reason })))

  dispatch(
    updateNotification(
      { payload: { uri } },
      {
        variant: 'error',
        message: intl.formatMessage(messages.channels_lnurl_channel_error, { uri, reason }),
        isProcessing: false,
      }
    )
  )
}

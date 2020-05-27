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
        message: intl.formatMessage(messages.channels_lnurl_channel_success, { service }),
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
        message: intl.formatMessage(messages.channels_lnurl_channel_error, { service, reason }),
        isProcessing: false,
      }
    )
  )
}

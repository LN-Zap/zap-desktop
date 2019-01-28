import delay from 'lib/utils/delay'

// ------------------------------------
// Initial State
// ------------------------------------
const initialState = {
  notifications: []
}

// ------------------------------------
// Constants
// ------------------------------------
const NOTIFICATION_TIMEOUT = 10000
export const ENQUEUE_NOTIFICATION = 'ENQUEUE_NOTIFICATION'
export const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION'

/**
 * Generates uniq id for notifications
 */
const genId = () =>
  Math.random()
    .toString(36)
    .substring(7)

// ------------------------------------
// Actions
// ------------------------------------
export const enqueueNotification = (message, variant, timeout) => async dispatch => {
  const notification = {
    id: genId(),
    message,
    variant
  }

  const notificationAction = dispatch({
    type: ENQUEUE_NOTIFICATION,
    notification
  })
  // Set a timer to clear the error after 10 seconds.
  if (timeout) {
    await delay(timeout)
    return dispatch(removeNotification(notification.id))
  }

  return notificationAction
}

export function removeNotification(id) {
  return {
    type: REMOVE_NOTIFICATION,
    id
  }
}

export const receiveError = (event, error) => dispatch => {
  dispatch(showError(error))
}

export const showError = (message, delay = NOTIFICATION_TIMEOUT) =>
  enqueueNotification(message, 'error', delay)
export const showNotification = (message, delay = NOTIFICATION_TIMEOUT) =>
  enqueueNotification(message, 'success', delay)
export const showWarning = (message, delay = NOTIFICATION_TIMEOUT) =>
  enqueueNotification(message, 'warning', delay)

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [ENQUEUE_NOTIFICATION]: (state, { notification }) => ({
    ...state,
    notifications: [...state.notifications, notification]
  }),
  [REMOVE_NOTIFICATION]: (state, { id }) => ({
    ...state,
    notifications: state.notifications.filter(item => item.id !== id)
  })
}

// ------------------------------------
// Selectors
// ------------------------------------

const notificationSelectors = {}
notificationSelectors.getNotificationState = state => state.notification.notifications

export { notificationSelectors }

// ------------------------------------
// Reducer
// ------------------------------------
export default function notificationReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}

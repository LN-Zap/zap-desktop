import delay from 'lib/utils/delay'
import genId from 'lib/utils/genId'
import matches from 'lodash.matches'

// ------------------------------------
// Initial State
// ------------------------------------
const initialState = {
  notifications: [],
}

// ------------------------------------
// Constants
// ------------------------------------
const NOTIFICATION_TIMEOUT = 10000
export const ENQUEUE_NOTIFICATION = 'ENQUEUE_NOTIFICATION'
export const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION'
export const UPDATE_NOTIFICATION = 'UPDATE_NOTIFICATION'

const createNotification = (options = {}) => {
  const { timeout = NOTIFICATION_TIMEOUT, variant = 'success' } = options
  return {
    ...options,
    timeout,
    variant,
    id: genId(),
  }
}
// ------------------------------------
// Actions
// ------------------------------------
export const enqueueNotification = options => async dispatch => {
  // Create a new notification using the options provided.
  const notification = createNotification(options)

  // Add it to the nbotification stack.
  const notificationAction = dispatch({
    type: ENQUEUE_NOTIFICATION,
    notification,
  })

  // Set a timer to clear the error after 10 seconds.
  const { timeout } = notification
  if (timeout) {
    await delay(timeout)
    return dispatch(removeNotification(notification.id))
  }

  return notificationAction
}

export const updateNotification = (predicate, options) => (dispatch, getState) => {
  const state = getState().notification

  // If there is an existing notification that matches the predicate, update that one.
  const matcher = matches(predicate)
  const existingNotification = state.notifications.find(matcher)

  if (existingNotification) {
    return dispatch({
      type: UPDATE_NOTIFICATION,
      id: existingNotification.id,
      options,
    })
  }

  // Otherwise, create a new one.
  return dispatch(enqueueNotification(options))
}

export function removeNotification(id) {
  return {
    type: REMOVE_NOTIFICATION,
    id,
  }
}

export const receiveError = (event, error) => dispatch => {
  dispatch(showError(error))
}

export const showError = (message, options = {}) => {
  return enqueueNotification({ ...options, message, variant: 'error' })
}

export const showNotification = (message, options = {}) => {
  return enqueueNotification({ ...options, message, variant: 'success' })
}

export const showWarning = (message, options = {}) => {
  return enqueueNotification({ ...options, message, variant: 'warning' })
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [ENQUEUE_NOTIFICATION]: (state, { notification }) => ({
    ...state,
    notifications: [...state.notifications, notification],
  }),

  [UPDATE_NOTIFICATION]: (state, { id, options }) => {
    const index = state.notifications.findIndex(n => n.id === id)
    const notifications =
      index >= 0
        ? [
            ...state.notifications.slice(0, index),
            {
              ...state.notifications[index],
              ...options,
            },
            ...state.notifications.slice(index + 1),
          ]
        : state.notifications

    return {
      ...state,
      notifications,
    }
  },

  [REMOVE_NOTIFICATION]: (state, { id }) => ({
    ...state,
    notifications: state.notifications.filter(item => item.id !== id),
  }),
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

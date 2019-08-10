import matches from 'lodash/matches'
import delay from '@zap/utils/delay'
import genId from '@zap/utils/genId'
import createReducer from './utils/createReducer'
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

// ------------------------------------
// Helpers
// ------------------------------------

/**
 * createNotification - Create a new notification.
 *
 * @param  {object} options Options
 * @param  {number} options.timeout Timeout until notification is removed
 * @param  {number} options.variant Notification variant
 * @returns {object} Notification
 */
const createNotification = (options = {}) => {
  const { timeout = NOTIFICATION_TIMEOUT, variant = 'success' } = options
  return {
    ...options,
    timeout,
    variant,
    id: genId(),
  }
}

/**
 * showError - Show an error notification.
 *
 * @param  {string} message Message
 * @param  {object} options Notification options
 * @returns {object} Action
 */
export const showError = (message, options = {}) => {
  return enqueueNotification({ ...options, message, variant: 'error' })
}

/**
 * showNotification - Show an info notification.
 *
 * @param  {string} message Message
 * @param  {object} options Notification options
 * @returns {object} Action
 */
export const showNotification = (message, options = {}) => {
  return enqueueNotification({ ...options, message, variant: 'success' })
}

/**
 * showWarning - Show a warning notification.
 *
 * @param  {string} message Message
 * @param  {object} options Notification options
 * @returns {object} Action
 */
export const showWarning = (message, options = {}) => {
  return enqueueNotification({ ...options, message, variant: 'warning' })
}

// ------------------------------------
// Actions
// ------------------------------------

/**
 * enqueueNotification - Push a notification onto the top of the stack.
 *
 * @param  {object} options Notification options
 * @returns {Function} Think
 */
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

/**
 * updateNotification - Update one or more existing notifications.
 *
 * @param  {object} predicate Predicate used to find notifications to modify
 * @param  {object} options Notification options
 * @returns {Function} Think
 */
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

/**
 * removeNotification - Remove a notification by id.
 *
 * @param  {string} id Notification Id
 * @returns {object} Action
 */
export function removeNotification(id) {
  return {
    type: REMOVE_NOTIFICATION,
    id,
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------

const ACTION_HANDLERS = {
  [ENQUEUE_NOTIFICATION]: (state, { notification }) => {
    state.notifications.push(notification)
  },

  [UPDATE_NOTIFICATION]: (state, { id, options }) => {
    const index = state.notifications.findIndex(n => n.id === id)
    if (index >= 0) {
      state.notifications[index] = { ...state.notifications[index], ...options }
    }
  },

  [REMOVE_NOTIFICATION]: (state, { id }) => {
    state.notifications = state.notifications.filter(item => item.id !== id)
  },
}

// ------------------------------------
// Selectors
// ------------------------------------

const notificationSelectors = {}
notificationSelectors.getNotificationState = state => state.notification.notifications

export { notificationSelectors }

export default createReducer(initialState, ACTION_HANDLERS)

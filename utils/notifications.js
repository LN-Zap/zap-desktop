/**
 * showSystemNotification - Show a system notification.
 *
 * @param {string} title Notification title
 * @param {object} options Notification options
 * @returns {Notification} HTML5 Notification
 */
export const showSystemNotification = (title, options) => {
  return new Notification(title, options)
}

export default { showSystemNotification }

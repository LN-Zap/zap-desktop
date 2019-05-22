/**
 * showSystemNotification - Show a system notification.
 *
 * @param {string} title Notification title
 * @param {string} body Notification body
 * @param {Function} onClick onClick handler
 */
export const showSystemNotification = (title, body, onClick) => {
  const notification = new Notification(title, { body })

  notification.onClick = onClick
}

export default { showSystemNotification }

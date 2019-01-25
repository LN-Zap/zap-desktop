export const showSystemNotification = (title, body, onClick) => {
  const notification = new Notification(title, { body })

  notification.onClick = onClick
}

export default { showSystemNotification }

export const showNotification = (title, body, onClick) => {
  new Notification(title, {
    body,
    onClick
  })
}

export default { showNotification }

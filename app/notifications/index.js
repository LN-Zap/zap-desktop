export default {
  showNotification: (title, body, onClick) => {
    new Notification(title, {
      body,
      onClick
    })
  }
}

import createIpc from 'redux-electron-ipc'
import { receivedInfo } from './info'

// Import all receiving IPC event handlers and pass them into createIpc
const ipc = createIpc({
  'receivedInfo': receivedInfo
})

export default ipc
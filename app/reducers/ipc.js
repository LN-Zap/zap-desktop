import createIpc from 'redux-electron-ipc'
import { receiveInfo } from './info'
import { receivePeers } from './peers'

// Import all receiving IPC event handlers and pass them into createIpc
const ipc = createIpc({
  'receiveInfo': receiveInfo,
  'receivePeers': receivePeers
})

export default ipc
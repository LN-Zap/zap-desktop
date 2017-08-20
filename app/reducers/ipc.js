import createIpc from 'redux-electron-ipc'
import { receiveInfo } from './info'
import { receivePeers } from './peers'
import { receiveChannels } from './channels'
import { receivePayments } from './payment'

// Import all receiving IPC event handlers and pass them into createIpc
const ipc = createIpc({
  'receiveInfo': receiveInfo,
  'receivePeers': receivePeers,
  'receiveChannels': receiveChannels,
  'receivePayments': receivePayments
})

export default ipc
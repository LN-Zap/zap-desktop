import config from 'config'

import createStorage from '@zap/utils/secureStorage'

import createCRUD from './ipcCRUD'

/**
 * createStorageService - Create secure storage service.
 *
 * @param {object} mainWindow Browser window
 */
export default function createStorageService(mainWindow) {
  const storage = createStorage(config.secureStorage.namespace)
  // helper func to send messages to the renderer process
  const send = (msg, params) => mainWindow.webContents.send(msg, params)
  createCRUD(storage, 'app-password', 'password', send)
}

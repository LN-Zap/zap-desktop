import { ipcMain } from 'electron'
import config from 'config'
import { mainLog } from '@zap/utils/log'
import createStorage from '@zap/utils/secureStorage'

/**
 * createStorageService - Create secure storage service.
 *
 * @param  {object} mainWindow Browser window
 */
export default function createStorageService(mainWindow) {
  const storage = createStorage(config.secureStorage.namespace)
  // helper func to send messages to the renderer process
  const send = (msg, params) => mainWindow.webContents.send(msg, params)
  const key = 'app-password'
  // performs password validity check against the one contained in secure storage
  ipcMain.on('getPassword', async () => {
    try {
      const password = await storage.getKey(key)
      send('getPassword', { password })
    } catch (e) {
      mainLog.warn('Unable to fetch app password: %o', e)
      send('getPassword')
    }
  })

  ipcMain.on('deletePassword', async () => {
    try {
      await storage.deleteKey(key)
      send('deletePasswordSuccess')
    } catch (e) {
      mainLog.warn('Unable to delete  app password: %o', e)
      send('deletePasswordFailure')
    }
  })

  // update password in the secure storage
  ipcMain.on('setPassword', async (event, { password }) => {
    try {
      await storage.setKey(key, password)
      send('setPasswordSuccess')
    } catch (e) {
      mainLog.warn('Unable to set app password: %o', e)
      send('setPasswordFailure')
    }
  })
}

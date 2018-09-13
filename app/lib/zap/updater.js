import { dialog } from 'electron'
import { autoUpdater } from 'electron-updater'
import isDev from 'electron-is-dev'
import { updaterLog } from '../utils/log'

autoUpdater.logger = updaterLog

/**
 * @class ZapController
 *
 * The ZapUpdater class manages the electron auto update process.
 */
class ZapUpdater {
  /**
   * Create a new ZapUpdater instance.
   * @param  {BrowserWindow} mainWindow BrowserWindow instance to interact with
   */
  constructor(mainWindow) {
    this.mainWindow = mainWindow
  }

  init() {
    // Do not run the updater if we are running in dev mode.
    if (isDev) {
      return
    }

    autoUpdater.on('update-downloaded', () => {
      const opt = {
        type: 'question',
        buttons: ['Install', 'Later'],
        title: 'Update available',
        message: 'An update is available. Restart the app and install?'
      }
      dialog.showMessageBox(this.mainWindow, opt, choice => {
        if (choice !== 0) {
          return
        }
        setTimeout(() => {
          autoUpdater.quitAndInstall()
        }, 100)
      })
    })

    this.initAutoUpdate()
  }

  initAutoUpdate() {
    autoUpdater.checkForUpdates()
    const oneHour = 60 * 60 * 1000
    setInterval(() => autoUpdater.checkForUpdates(), oneHour)
  }
}

export default ZapUpdater

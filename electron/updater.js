import { dialog } from 'electron'
import { autoUpdater } from 'electron-updater'
import isDev from 'electron-is-dev'
import { updaterLog } from '@zap/utils/log'
import delay from '@zap/utils/delay'

autoUpdater.logger = updaterLog

/**
 * Update Channel
 * supported channels are 'alpha', 'beta' and 'latest'
 * Refer electron-builder docs
 */
autoUpdater.channel = process.env.AUTOUPDATE_CHANNEL || 'beta'
autoUpdater.allowDowngrade = false

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
        message: 'An update is available. Restart the app and install?',
      }
      dialog.showMessageBox(this.mainWindow, opt, async choice => {
        if (choice !== 0) {
          return
        }
        await delay(100)
        autoUpdater.quitAndInstall()
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

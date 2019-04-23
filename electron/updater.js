import { dialog } from 'electron'
import { autoUpdater } from 'electron-updater'
import isDev from 'electron-is-dev'
import config from 'config'
import { updaterLog } from '@zap/utils/log'
import delay from '@zap/utils/delay'

autoUpdater.logger = updaterLog
autoUpdater.channel = config.autoupdate.channel
autoUpdater.allowDowngrade = false

/**
 * @class ZapUpdater
 *
 * The ZapUpdater class manages the electron auto update process.
 */
class ZapUpdater {
  constructor(mainWindow) {
    this.mainWindow = mainWindow
  }

  init() {
    // Do not run the updater if we are running in dev mode or if autoupdates are disabled.
    if (isDev || !config.autoupdate.active) {
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

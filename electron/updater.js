import { dialog, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
import isDev from 'electron-is-dev'
import config from 'config'
import delay from '@zap/utils/delay'
import { updaterLog } from '@zap/utils/log'

/**
 * @class ZapUpdater
 *
 * The ZapUpdater class manages the electron auto update process.
 */
class ZapUpdater {
  constructor(mainWindow, options = {}) {
    const settings = { ...config.autopilot, options }

    this.mainWindow = mainWindow
    this.isActive = false
    this.timer = null

    autoUpdater.logger = updaterLog
    autoUpdater.channel = settings.channel
    autoUpdater.allowDowngrade = false

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

    // Enable updates if needed.
    if (settings.active && !isDev) {
      this.enableAutoUpdates()
    }

    ipcMain.on('configureAutoUpdater', (event, settings) => {
      settings.active ? this.enableAutoUpdates() : this.disableAutoUpdates()
    })
  }

  /**
   * Enable automatic updates.
   */
  enableAutoUpdates() {
    if (this.isActive || isDev) {
      return
    }
    try {
      updaterLog.info('Automatic Updates enabled')
      this.isActive = true
      autoUpdater.checkForUpdates()
      const oneHour = 60 * 60 * 1000
      this.timer = setInterval(() => autoUpdater.checkForUpdates(), oneHour)
    } catch (error) {
      updaterLog.warn('Cannot check for updates', error.message)
    }
  }

  /**
   * Disable automatic updates.
   */
  disableAutoUpdates() {
    if (!this.isActive || isDev) {
      return
    }
    clearInterval(this.timer)
    updaterLog.info('Automatic Updates disabled')
  }
}

export default ZapUpdater

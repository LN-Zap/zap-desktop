import { dialog, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
import isDev from 'electron-is-dev'
import config from 'config'
import delay from '@zap/utils/delay'
import createScheduler from '@zap/utils/scheduler'
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
    this.scheduler = createScheduler()

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
   * enableAutoUpdates - Enable automatic updates.
   */
  enableAutoUpdates() {
    if (this.isActive || isDev) {
      return
    }
    try {
      updaterLog.info('Automatic Updates enabled')
      this.isActive = true
      autoUpdater.checkForUpdates()
      this.scheduler.addTask({
        taskId: 'checkForUpdates',
        task: () => autoUpdater.checkForUpdates(),
        baseDelay: config.autoupdate.interval,
      })
    } catch (error) {
      updaterLog.warn('Cannot check for updates', error.message)
    }
  }

  /**
   * disableAutoUpdates - Disable automatic updates.
   */
  disableAutoUpdates() {
    if (!this.isActive || isDev) {
      return
    }
    this.scheduler.removeTask('checkForUpdates')
    updaterLog.info('Automatic Updates disabled')
  }
}

export default ZapUpdater

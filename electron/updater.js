import { dialog, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
import isDev from 'electron-is-dev'
import config from 'config'
import delay from '@zap/utils/delay'
import createScheduler from '@zap/utils/scheduler'
import { updaterLog } from '@zap/utils/log'

autoUpdater.logger = updaterLog

/**
 * @class ZapUpdater
 *
 * The ZapUpdater class manages the electron auto update process.
 */
class ZapUpdater {
  constructor(mainWindow, options = {}) {
    this.mainWindow = mainWindow
    this.isActive = false
    this.scheduler = createScheduler()
    this.settings = {}

    this.configure({ ...config.autoupdate, ...options })

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
    if (this.settings.active && !isDev) {
      this.enableAutoUpdates()
    } else {
      updaterLog.info('Automatic updates not enabled')
    }

    ipcMain.on('configureAutoUpdater', (event, settings) => {
      this.configure(settings)
      this.settings.active ? this.enableAutoUpdates() : this.disableAutoUpdates()
    })
  }

  /**
   * configure - Configure the auto updater.
   *
   * @param {object} settings Settings
   */
  configure(settings) {
    Object.assign(this.settings, settings)

    autoUpdater.channel = this.settings.channel
    autoUpdater.allowDowngrade = false
  }

  /**
   * enableAutoUpdates - Enable automatic updates.
   */
  enableAutoUpdates() {
    if (this.isActive || isDev) {
      return
    }
    try {
      updaterLog.info('Automatic updates enabled')
      autoUpdater.checkForUpdates()
      this.scheduler.addTask({
        taskId: 'checkForUpdates',
        task: () => autoUpdater.checkForUpdates(),
        baseDelay: this.settings.interval,
      })
      this.isActive = true
    } catch (error) {
      updaterLog.warn('There was a problem enabling auto updates: %s', error.message)
      this.isActive = false
      this.scheduler.removeAllTasks()
    }
  }

  /**
   * disableAutoUpdates - Disable automatic updates.
   */
  disableAutoUpdates() {
    if (!this.isActive || isDev) {
      return
    }
    try {
      this.scheduler.removeAllTasks()
      this.isActive = false
      updaterLog.info('Automatic updates disabled')
    } catch (error) {
      updaterLog.warn('There was a problem disabling auto updates: %s', error.message)
    }
  }
}

export default ZapUpdater

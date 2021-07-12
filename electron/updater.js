import config from 'config'
import { dialog, ipcMain } from 'electron'
import isDev from 'electron-is-dev'
import { autoUpdater } from 'electron-updater'

import delay from '@zap/utils/delay'
import { updaterLog } from '@zap/utils/log'
import createScheduler from '@zap/utils/scheduler'

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

    autoUpdater.on('update-downloaded', async info => {
      updaterLog.info('Downloaded update: %o', info)
      const dialogOpts = {
        type: 'info',
        buttons: ['Restart', 'Later'],
        title: 'Application Update',
        message: 'A new version has been downloaded. Restart the application to apply the updates.',
      }
      const returnValue = await dialog.showMessageBox(this.mainWindow, dialogOpts)
      if (returnValue.response === 0) {
        await delay(500)
        mainWindow.forceClose = true
        autoUpdater.quitAndInstall()
      }
    })

    autoUpdater.on('error', message => {
      updaterLog.warn('There was a problem updating the application: %s', message)
      dialog.showErrorBox('There was a problem updating the application', message)
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

import { app, ipcMain } from 'electron'

import { mainLog } from '@zap/utils/log'
import sanitize from '@zap/utils/sanitize'

/**
 * @class ZapController
 *
 * The ZapController class coordinates actions between the the main and renderer processes.
 */
class ZapController {
  /**
   * constructor - Create a new ZapController instance.
   *
   * @param {object} mainWindow BrowserWindow instance to interact with.
   */
  constructor(mainWindow) {
    // Variable to hold the main window instance.
    this.mainWindow = mainWindow

    // Active process pids, keyed by process name.
    this.processes = {}

    // Register IPC listeners so that we can react to instructions coming from the app.
    ipcMain.on('killNeutrino', (event, signal) => {
      ipcMain.once('killNeutrinoSuccess', () => this.sendMessage('killNeutrinoSuccess'))
      this.sendMessage('killNeutrino', signal)
    })
    ipcMain.on('processSpawn', (event, { name, pid }) => {
      this.processes[name] = pid
    })
    ipcMain.on('processExit', (event, { name }) => {
      this.processes[name] = null
    })
  }

  /**
   * init - Initialize the controller.
   *
   * @param {[object]} options Options to pass through to the renderer
   */
  init(options) {
    // Load the application into the main window.
    if (process.env.HOT) {
      const port = process.env.PORT || 1212
      this.mainWindow.loadURL(`http://localhost:${port}/dist/index.html`)
    } else {
      this.mainWindow.loadURL(`file://${__dirname}/index.html`)
    }

    // Once the winow content has fully loaded, bootstrap the app.
    this.mainWindow.webContents.on('did-finish-load', () => {
      mainLog.trace('webContents.did-finish-load')

      // Show the window as soon as the application has finished loading.
      this.mainWindow.show()
      this.mainWindow.focus()

      // Start app.
      this.initApp(options)
    })
  }

  /**
   * initApp - Initialise the app.
   *
   * @param {[object]} options Options to pass through to the renderer
   */
  initApp(options) {
    mainLog.debug('initApp...')
    // In the case the app is reloaded usung ctrl+r the app will aborted instantly without being given a chance to
    // shutdown any processes spawned by it. Before starting the app again, kill any processes known to have been
    // started by us.
    this.killAllSpawnedProcesses()
    // Send a signal to the renderer process telling it to start it's initialisation.
    this.sendMessage('initApp', options)
  }

  /**
   * terminate - Terminate the app.
   */
  terminate() {
    mainLog.debug('terminate...')
    // Send a message to the renderer process telling it to to gracefully shutdown. We register a success callback with
    // it so that we can complete the termination and quit electon once the app has been fully shutdown.
    ipcMain.on('terminateAppSuccess', () => app.quit())

    ipcMain.on('terminateAppFailed', (event, e) => {
      mainLog.info('terminateAppFailed: %o', e)
      this.killAllSpawnedProcesses()
      app.quit()
    })

    this.sendMessage('terminateApp')
  }

  /**
   * sendMessage - Send a message to the main window.
   *
   * @param {string} msg message to send.
   * @param {object} data additional data to accompany the message.
   */
  sendMessage(msg, data) {
    if (this.mainWindow) {
      mainLog.info('Sending message to renderer process: %o', {
        msg,
        data: sanitize(data, ['lndconnectUri', 'lndconnectQRCode']),
      })
      this.mainWindow.webContents.send(msg, data)
    } else {
      mainLog.warn('Unable to send message to renderer process (main window not available): %o', {
        msg,
        data,
      })
    }
  }

  /**
   * killAllSpawnedProcesses - Terminate any processes known to have been started by the app.
   */
  killAllSpawnedProcesses() {
    Object.keys(this.processes).forEach(key => {
      const pid = this.processes[key]
      if (pid) {
        mainLog.debug(`Killing ${key} process with pid ${pid}`)
        try {
          process.kill(pid)
        } catch (e) {
          mainLog.warn(`Unable to kill ${key} process with pid ${pid}`)
        } finally {
          this.processes[key] = null
        }
      }
    })
  }
}

export default ZapController

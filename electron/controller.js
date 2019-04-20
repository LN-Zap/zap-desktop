import { app, ipcMain } from 'electron'
import StateMachine from 'javascript-state-machine'
import { mainLog } from '@zap/utils/log'
import sanitize from '@zap/utils/sanitize'

/**
 * @class ZapController
 *
 * The ZapController class coordinates actions between the the main and renderer processes.
 */
class ZapController {
  /**
   * Create a new ZapController instance.
   * @param {BrowserWindow} mainWindow BrowserWindow instance to interact with.
   */
  constructor(mainWindow) {
    // Variable to hold the main window instance.
    this.mainWindow = mainWindow

    // Active process pids, keyed by process name.
    this.processes = {}

    // Register IPC listeners so that we can react to instructions coming from the app.
    this._registerIpcListeners()
  }

  /**
   * Initialize the controller.
   */
  init() {
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

      // Initialise a state machine that we will use to control application state transitions.
      this.fsm = new StateMachine({
        transitions: [
          { name: 'initApp', from: '*', to: 'running' },
          { name: 'terminate', from: '*', to: 'terminated' },
        ],
        methods: {
          onInitApp: this.onInitApp.bind(this),
          onTerminate: this.onTerminate.bind(this),
        },
      })

      // Show the window as soon as the application has finished loading.
      this.mainWindow.show()
      this.mainWindow.focus()

      // Start app.
      this.initApp()
    })
  }

  // ------------------------------------
  // FSM Proxies
  // ------------------------------------

  initApp(...args) {
    return this.fsm.initApp(...args)
  }
  terminate(...args) {
    return this.fsm.terminate(...args)
  }
  is(...args) {
    return this.fsm.is(...args)
  }
  can(...args) {
    return this.fsm.can(...args)
  }

  // ------------------------------------
  // FSM Callbacks
  // ------------------------------------

  onInitApp() {
    mainLog.debug('[FSM] onInitApp...')
    this.killAllZombieProcesses()
    this.sendMessage('initApp')
  }

  onTerminate() {
    mainLog.debug('[FSM] onTerminate...')
    this.sendMessage('terminateApp', 'terminateAppSuccess')
    ipcMain.on('terminateAppSuccess', () => app.quit())
  }

  // ------------------------------------
  // Helpers
  // ------------------------------------

  /**
   * Send a message to the main window.
   * @param  {string} msg message to send.
   * @param  {[type]} data additional data to accompany the message.
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

  killAllZombieProcesses() {
    Object.keys(this.processes).forEach(key => {
      const pid = this.processes[key]
      if (pid) {
        mainLog.debug(`Killing zombie ${key} process with pid ${pid}`)
        try {
          process.kill(pid)
        } catch (e) {
          mainLog.warn(`Unable to kill zombie ${key} process with pid ${pid}`)
        }
        this.processes[key] = null
      }
    })
  }

  _registerIpcListeners() {
    ipcMain.on('killLnd', () => {
      ipcMain.once('killLndSuccess', () => this.sendMessage('killLndSuccess'))
      this.sendMessage('terminateApp', 'killLndSuccess')
    })
    ipcMain.on('processSpawn', (event, { name, pid }) => {
      this.processes[name] = pid
    })
    ipcMain.on('processExit', ({ name }) => {
      this.processes[name] = null
    })
  }

  /**
   * Add IPC event listeners...
   */
  _removeIpcListeners() {
    ipcMain.removeAllListeners('killLnd')
    ipcMain.removeAllListeners('killLndSuccess')
    ipcMain.removeAllListeners('processSpawn')
    ipcMain.removeAllListeners('processExit')
  }
}

export default ZapController

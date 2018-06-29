import { app, ipcMain, dialog } from 'electron'
import Store from 'electron-store'
import { mainLog } from '../utils/log'
import lnd from '../lnd'
import Neutrino from '../lnd/neutrino'

/**
 * @class ZapController
 *
 * The ZapController class coordinates actions between the the main nand renderer processes.
 */
class ZapController {
  /**
   * Create a new ZapController instance.
   * @param  {BrowserWindow} mainWindow BrowserWindow instance to interact with
   * @param  {String|Promise} mode String or Promise that resolves to the desired run mode. Valid options are:
   *  - 'internal': start a new lnd process.
   *  - 'external': connect to an existing lnd process.
   */
  constructor(mainWindow, mode) {
    this.mode = mode

    // Variable to hold the main window instance.
    this.mainWindow = mainWindow

    // Keep a reference any neutrino process started by us.
    this.neutrino = null

    // Time for the splash screen to remain visible.
    this.splashScreenTime = 500
  }

  /**
   * Initialize the application.
   */
  init() {
    if (process.env.HOT) {
      const port = process.env.PORT || 1212
      this.mainWindow.loadURL(`http://localhost:${port}/dist/index.html`)
    } else {
      this.mainWindow.loadURL(`file://${__dirname}/dist/index.html`)
    }

    // Register IPC listeners so that we can react to instructions coming from the app.
    this._registerIpcListeners()

    // Show the window as soon as the application has finished loading.
    this.mainWindow.webContents.on('did-finish-load', async () => {
      this.mainWindow.show()
      this.mainWindow.focus()
      mainLog.timeEnd('Time until app is visible')
      mainLog.time('Time until we know the run mode')

      Promise.resolve(this.mode)
        .then(mode => {
          const timeUntilWeKnowTheRunMode = mainLog.timeEnd('Time until we know the run mode')
          return setTimeout(() => {
            if (mode === 'external') {
              // If lnd is already running, create and subscribe to the Lightning grpc object.
              this.startGrpc()
              this.sendMessage('successfullyCreatedWallet')
            } else {
              // Otherwise, start the onboarding process.
              this.sendMessage('startOnboarding')
              mainLog.timeEnd('Time until onboarding has started')
            }
          }, timeUntilWeKnowTheRunMode < this.splashScreenTime ? this.splashScreenTime : 0)
        })
        .catch(mainLog.error)
    })

    this.mainWindow.on('closed', () => {
      this.mainWindow = null

      // shut down zap when a user closes the window
      app.quit()
    })
  }

  /**
   * Send a message to the main window.
   * @param  {string} msg message to send.
   * @param  {[type]} data additional data to acompany the message.
   */
  sendMessage(msg, data) {
    mainLog.info('Sending message to renderer process: %o', { msg, data })
    this.mainWindow.webContents.send(msg, data)
  }

  /**
   * Create and subscribe to the Lightning grpc object.
   */
  startGrpc() {
    mainLog.info('Starting gRPC...')
    try {
      const { lndSubscribe, lndMethods } = lnd.initLnd()

      // Subscribe to bi-directional streams
      lndSubscribe(this.mainWindow)

      // Listen for all gRPC restful methods
      ipcMain.on('lnd', (event, { msg, data }) => {
        lndMethods(event, msg, data)
      })

      this.sendMessage('grpcConnected')
    } catch (error) {
      dialog.showMessageBox({
        type: 'error',
        message: `Unable to connect to lnd. Please check your lnd node and try again: ${error}`
      })
      app.quit()
    }
  }

  /**
   * Create and subscribe to the WalletUnlocker grpc object.
   */
  startWalletUnlocker() {
    mainLog.info('Starting wallet unlocker...')
    try {
      const walletUnlockerMethods = lnd.initWalletUnlocker()

      // Listen for all gRPC restful methods
      ipcMain.on('walletUnlocker', (event, { msg, data }) => {
        walletUnlockerMethods(event, msg, data)
      })

      this.sendMessage('walletUnlockerStarted')
    } catch (error) {
      dialog.showMessageBox({
        type: 'error',
        message: `Unable to start lnd wallet unlocker. Please check your lnd node and try again: ${error}`
      })
      app.quit()
    }
  }

  /**
   * Starts the LND node and attach event listeners.
   * @param  {string} alias Alias to assign to the lnd node.
   * @param  {boolean} autopilot True if autopilot should be enabled.
   * @return {Neutrino} Neutrino instance.
   */
  startLnd(alias, autopilot) {
    this.neutrino = new Neutrino(alias, autopilot)

    this.neutrino.on('error', error => {
      mainLog.error(`Got error from lnd process: ${error})`)
      dialog.showMessageBox({
        type: 'error',
        message: `lnd error: ${error}`
      })
    })

    this.neutrino.on('close', code => {
      mainLog.info(`Lnd process has shut down (code ${code})`)
      app.quit()
    })

    this.neutrino.on('grpc-proxy-started', () => {
      mainLog.info('gRPC proxy started')
      this.startWalletUnlocker()
    })

    this.neutrino.on('wallet-opened', () => {
      mainLog.info('Wallet opened')
      this.startGrpc()
      this.sendMessage('lndSyncing')
    })

    this.neutrino.on('fully-synced', () => {
      mainLog.info('Neutrino fully synced')
      this.sendMessage('lndSynced')
    })

    this.neutrino.on('got-block-height', line => {
      this.sendMessage('lndStdout', line)
    })

    this.neutrino.start()
  }

  /**
   * Add IPC event listeners...
   */
  _registerIpcListeners() {
    ipcMain.on('startLnd', (event, options = {}) => {
      const store = new Store({ name: 'connection' })
      store.store = {
        type: options.connectionType,
        host: options.connectionHost,
        cert: options.connectionCert,
        macaroon: options.connectionMacaroon,
        alias: options.alias,
        autopilot: options.autopilot
      }
      mainLog.info('Saved lnd config to:', store.path)

      if (options.connectionType === 'local') {
        mainLog.info('Starting new lnd instance')
        mainLog.debug(' > alias:', options.alias)
        mainLog.debug(' > autopilot:', options.autopilot)
        this.startLnd(options.alias, options.autopilot)
      } else {
        mainLog.info('Connecting to custom lnd instance')
        mainLog.debug(' > connectionHost:', options.connectionHost)
        mainLog.debug(' > connectionCert:', options.connectionCert)
        mainLog.debug(' > connectionMacaroon:', options.connectionMacaroon)
        this.startGrpc()
        this.sendMessage('successfullyCreatedWallet')
      }
    })
  }
}

export default ZapController

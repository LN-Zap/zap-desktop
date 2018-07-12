import { app, ipcMain, dialog } from 'electron'
import Store from 'electron-store'
import lnd from './lnd'
import Neutrino from './lnd/lib/neutrino'
import { mainLog } from './utils/log'

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
    this.mainWindow.webContents.on('did-finish-load', () => {
      this.mainWindow.show()
      this.mainWindow.focus()
      mainLog.timeEnd('Time until app is visible')
      mainLog.time('Time until we know the run mode')

      Promise.resolve(this.mode)
        .then(mode => {
          const timeUntilWeKnowTheRunMode = mainLog.timeEnd('Time until we know the run mode')
          return setTimeout(async () => {
            if (mode === 'external') {
              // If lnd is already running, create and subscribe to the Lightning grpc object.
              await this.startGrpc()
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
  async startGrpc() {
    mainLog.info('Starting gRPC...')
    const { lndSubscribe, lndMethods } = await lnd.initLnd()

    // Subscribe to bi-directional streams
    lndSubscribe(this.mainWindow)

    // Listen for all gRPC restful methods
    ipcMain.on('lnd', (event, { msg, data }) => {
      lndMethods(event, msg, data)
    })

    this.sendMessage('grpcConnected')
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
    })

    this.neutrino.on('chain-sync-started', () => {
      mainLog.info('Neutrino sync started')
      this.sendMessage('lndSyncing')
    })

    this.neutrino.on('chain-sync-finished', () => {
      mainLog.info('Neutrino sync finished')
      this.sendMessage('lndSynced')
    })

    this.neutrino.on('got-current-block-height', height => {
      this.sendMessage('currentBlockHeight', Number(height))
    })

    this.neutrino.on('got-lnd-block-height', height => {
      this.sendMessage('lndBlockHeight', Number(height))
    })

    this.neutrino.start()
  }

  /**
   * Add IPC event listeners...
   */
  _registerIpcListeners() {
    ipcMain.on('startLnd', (event, options = {}) => {
      // Trim any user supplied strings.
      const cleanOptions = Object.keys(options).reduce((previous, current) => {
        previous[current] =
          typeof options[current] === 'string' ? options[current].trim() : options[current]
        return previous
      }, {})

      // Save the options.
      const store = new Store({ name: 'connection' })
      store.store = cleanOptions
      mainLog.info('Saved lnd config to:', store.path)

      // If the requested connection type is a local one then start up a new lnd instance.
      if (cleanOptions.type === 'local') {
        mainLog.info('Starting new lnd instance')
        mainLog.debug(' > alias:', cleanOptions.alias)
        mainLog.debug(' > autopilot:', cleanOptions.autopilot)
        this.startLnd(cleanOptions.alias, cleanOptions.autopilot)
      }
      // Otherwise attempt to connect to an lnd instance using user supplied connection details.
      else {
        mainLog.info('Connecting to custom lnd instance')
        mainLog.debug(' > host:', cleanOptions.host)
        mainLog.debug(' > cert:', cleanOptions.cert)
        mainLog.debug(' > macaroon:', cleanOptions.macaroon)
        this.startGrpc()
          .then(() => this.sendMessage('successfullyCreatedWallet'))
          .catch(e => {
            const errors = {}
            // There was a problem connectig to the host.
            if (e.code === 'LND_GRPC_HOST_ERROR') {
              errors.host = e.message
            }
            // There was a problem accessing loading the ssl cert.
            if (e.code === 'LND_GRPC_CERT_ERROR') {
              errors.cert = e.message
            }
            //  There was a problem accessing loading the macaroon file.
            else if (e.code === 'LND_GRPC_MACAROON_ERROR') {
              errors.macaroon = e.message
            }
            // Other error codes such as UNAVAILABLE most likely indicate that there is a problem with the host.
            else {
              errors.host = `Unable to connect to host: ${e.details || e.message}`
            }

            // Notify the app of errors.
            return this.sendMessage('startLndError', errors)
          })
      }
    })
  }
}

export default ZapController

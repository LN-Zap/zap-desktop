import { app, ipcMain, dialog } from 'electron'
import Store from 'electron-store'
import StateMachine from 'javascript-state-machine'
import lnd from './lnd'
import Neutrino from './lnd/lib/neutrino'
import Lightning from './lnd/lib/lightning'
import { mainLog } from './utils/log'
import { isLndRunning } from './lnd/lib/util'

const grpcSslCipherSuites = connectionType =>
  (connectionType === 'btcpayserver'
    ? [
        // BTCPay Server serves lnd behind an nginx proxy with a trusted SSL cert from Lets Encrypt.
        // These certs use an RSA TLS cipher suite.
        'ECDHE-RSA-AES256-GCM-SHA384',
        'ECDHE-RSA-AES128-GCM-SHA256'
      ]
    : [
        // Default is ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384
        // https://github.com/grpc/grpc/blob/master/doc/environment_variables.md
        //
        // Current LND cipher suites here:
        // https://github.com/lightningnetwork/lnd/blob/master/lnd.go#L80
        //
        // We order the suites by priority, based on the recommendations provided by SSL Labs here:
        // https://github.com/ssllabs/research/wiki/SSL-and-TLS-Deployment-Best-Practices#23-use-secure-cipher-suites
        'ECDHE-ECDSA-AES128-GCM-SHA256',
        'ECDHE-ECDSA-AES256-GCM-SHA384',
        'ECDHE-ECDSA-AES128-CBC-SHA256',
        'ECDHE-ECDSA-CHACHA20-POLY1305'
      ]
  ).join(':')

/**
 * @class ZapController
 *
 * The ZapController class coordinates actions between the the main nand renderer processes.
 */
class ZapController {
  /**
   * Create a new ZapController instance.
   * @param {BrowserWindow} mainWindow BrowserWindow instance to interact with.
   */
  constructor(mainWindow) {
    // Variable to hold the main window instance.
    this.mainWindow = mainWindow

    // Keep a reference any neutrino process started by us.
    this.neutrino = null

    // Keep a reference to the lightning gRPC instance.
    this.lightning = null

    // Time for the splash screen to remain visible.
    this.splashScreenTime = 500

    // Boolean indicating wether the lightning grpc is connected ot not.
    this.lightningGrpcConnected = false

    // Initialize the state machine.
    this._fsm()
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
      this.mainWindow.loadURL(`file://${__dirname}/dist/index.html`)
    }

    // Register IPC listeners so that we can react to instructions coming from the app.
    this._registerIpcListeners()

    // Show the window as soon as the application has finished loading.
    this.mainWindow.webContents.on('did-finish-load', () => {
      this.mainWindow.show()
      this.mainWindow.focus()

      // Show the splash screen and then start onboarding.
      setTimeout(() => this.startOnboarding(), this.splashScreenTime)
    })

    // When the window is closed, just hide it unless we are force closing.
    this.mainWindow.on('close', e => {
      if (this.mainWindow.forceClose) {
        return
      }
      e.preventDefault()
      this.mainWindow.hide()
    })
  }

  // ------------------------------------
  // FSM Callbacks
  // ------------------------------------

  onStartOnboarding() {
    mainLog.debug('[FSM] onStartOnboarding...')
    this.sendMessage('startOnboarding')
  }

  onStartLnd(options) {
    mainLog.debug('[FSM] onStartLnd...')
    return isLndRunning().then(res => {
      if (res) {
        mainLog.error('lnd already running: %s', res)
        dialog.showMessageBox({
          type: 'error',
          message: 'Unable to start lnd because it is already running.'
        })
        return app.quit()
      }
      mainLog.info('Starting new lnd instance')
      mainLog.info(' > alias:', options.alias)
      mainLog.info(' > autopilot:', options.autopilot)
      return this.startNeutrino(options.alias, options.autopilot)
    })
  }

  onConnectLnd(options) {
    mainLog.debug('[FSM] onConnectLnd...')
    mainLog.info('Connecting to custom lnd instance')
    mainLog.info(' > host:', options.host)
    mainLog.info(' > cert:', options.cert)
    mainLog.info(' > macaroon:', options.macaroon)
    this.startLightningWallet()
      .then(() => this.sendMessage('finishOnboarding'))
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

  onTerminated() {
    mainLog.debug('[FSM] onTerminated...')
    // Unsubscribe the gRPC streams before thhe window closes. This ensures that we can properly reestablish a fresh
    // connection when a new window is opened.
    this.disconnectLightningWallet()

    // If Neutrino is running, kill it.
    if (this.neutrino) {
      this.neutrino.stop()
    }

    // Give the grpc connections a chance to be properly closed out.
    return new Promise(resolve => setTimeout(resolve, 200))
  }

  onTerminate() {
    mainLog.debug('[FSM] onTerminate...')
    app.quit()
  }

  // ------------------------------------
  // Helpers
  // ------------------------------------

  /**
   * Send a message to the main window.
   * @param  {string} msg message to send.
   * @param  {[type]} data additional data to acompany the message.
   */
  sendMessage(msg, data) {
    if (this.mainWindow) {
      mainLog.info('Sending message to renderer process: %o', { msg, data })
      this.mainWindow.webContents.send(msg, data)
    } else {
      mainLog.warn('Unable to send message to renderer process (main window not available): %o', {
        msg,
        data
      })
    }
  }

  /**
   * Start the wallet unlocker.
   */
  startWalletUnlocker() {
    mainLog.info('Starting wallet unlocker...')
    try {
      const walletUnlockerMethods = lnd.initWalletUnlocker()

      // Listen for all gRPC restful methods
      ipcMain.on('walletUnlocker', (event, { msg, data }) => {
        walletUnlockerMethods(event, msg, data)
      })

      // Notify the renderer that the wallet unlocker is active.
      this.sendMessage('walletUnlockerGrpcActive')
    } catch (error) {
      dialog.showMessageBox({
        type: 'error',
        message: `Unable to start lnd wallet unlocker. Please check your lnd node and try again: ${error}`
      })
      app.quit()
    }
  }

  /**
   * Create and subscribe to the Lightning service.
   */
  async startLightningWallet() {
    mainLog.info('Starting lightning wallet...')
    this.lightning = new Lightning()

    // Connect to the Lightning interface.
    await this.lightning.connect()

    // Subscribe the main window to receive streams.
    this.lightning.subscribe(this.mainWindow)

    // Listen for all gRPC restful methods and pass to gRPC.
    ipcMain.on('lnd', (event, { msg, data }) => this.lightning.lndMethods(event, msg, data))

    // Let the renderer know that we are connected.
    this.sendMessage('lightningGrpcActive')

    // Update our internal state.
    this.lightningGrpcConnected = true
  }

  /**
   * Unsubscribe from the Lightning service.
   */
  disconnectLightningWallet() {
    if (!this.lightningGrpcConnected) {
      return
    }
    mainLog.info('Disconnecting lightning Wallet...')

    // Disconnect streams.
    this.lightning.unsubscribe()

    // Update our internal state.
    this.lightningGrpcConnected = false
  }

  /**
  /**
   * Starts the LND node and attach event listeners.
   * @param  {string} alias Alias to assign to the lnd node.
   * @param  {boolean} autopilot True if autopilot should be enabled.
   * @return {Neutrino} Neutrino instance.
   */
  startNeutrino(alias, autopilot) {
    mainLog.info('Starting Neutrino...')
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
      if (['running', 'connected'].includes(this.state)) {
        dialog.showMessageBox({
          type: 'error',
          message: `Lnd has unexpectadly quit`
        })
        this.terminate()
      }
    })

    this.neutrino.on('wallet-unlocker-grpc-active', () => {
      mainLog.info('Wallet unlocker gRPC active')
      this.startWalletUnlocker()
    })

    this.neutrino.on('lightning-grpc-active', () => {
      mainLog.info('Lightning gRPC active')
      this.startLightningWallet()
    })

    this.neutrino.on('chain-sync-waiting', () => {
      mainLog.info('Neutrino sync waiting')
      this.sendMessage('lndSyncStatus', 'waiting')
    })

    this.neutrino.on('chain-sync-started', () => {
      mainLog.info('Neutrino sync started')
      this.sendMessage('lndSyncStatus', 'in-progress')
    })

    this.neutrino.on('chain-sync-finished', () => {
      mainLog.info('Neutrino sync finished')
      this.sendMessage('lndSyncStatus', 'complete')
    })

    this.neutrino.on('got-current-block-height', height => {
      this.sendMessage('currentBlockHeight', Number(height))
    })

    this.neutrino.on('got-lnd-block-height', height => {
      this.sendMessage('lndBlockHeight', Number(height))
    })

    this.neutrino.start()
  }

  finishOnboarding(options) {
    // Trim any user supplied strings.
    const cleanOptions = Object.keys(options).reduce((previous, current) => {
      previous[current] =
        typeof options[current] === 'string' ? options[current].trim() : options[current]
      return previous
    }, {})

    // Save the options.
    const store = new Store({ name: 'connection' })
    store.store = cleanOptions
    mainLog.info('Saved lnd config to %s: %o', store.path, store.store)

    // Set up SSL with the cypher suits that we need based on the connection type.
    process.env.GRPC_SSL_CIPHER_SUITES =
      process.env.GRPC_SSL_CIPHER_SUITES || grpcSslCipherSuites(options.type)

    // If the requested connection type is a local one then start up a new lnd instance.
    // // Otherwise attempt to connect to an lnd instance using user supplied connection details.
    cleanOptions.type === 'local' ? this.startLnd() : this.connectLnd()
  }

  /**
   * Add IPC event listeners...
   */
  _registerIpcListeners() {
    ipcMain.on('startLnd', (event, options = {}) => this.finishOnboarding(options))
  }
}

StateMachine.factory(ZapController, {
  transitions: [
    { name: 'startOnboarding', from: 'none', to: 'onboarding' },
    { name: 'startLnd', from: 'onboarding', to: 'running' },
    { name: 'connectLnd', from: 'onboarding', to: 'connected' },
    { name: 'terminate', from: '*', to: 'terminated' }
  ]
})

export default ZapController

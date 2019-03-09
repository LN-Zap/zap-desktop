// @flow
import { app, ipcMain, dialog, BrowserWindow } from 'electron'
import StateMachine from 'javascript-state-machine'
import { mainLog } from '../utils/log'
import delay from '../utils/delay'
import truncate from '../utils/truncate'
import sanitize from '../utils/sanitize'
import LndConfig, { type LndConfigOptions } from '../lnd/config'
import Lightning from '../lnd/lightning'
import Neutrino from '../lnd/neutrino'
import WalletUnlocker from '../lnd/walletUnlocker'

const LND_GRPC_HOST_ERROR = 'LND_GRPC_HOST_ERROR'
const LND_GRPC_CERT_ERROR = 'LND_GRPC_CERT_ERROR'
const LND_GRPC_MACAROON_ERROR = 'LND_GRPC_MACAROON_ERROR'
const LND_METHOD_UNAVAILABLE = 12

type shutdownOptions = {
  signal?: string,
  timeout?: number,
}

const grpcSslCipherSuites = () => {
  return [
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
    'ECDHE-ECDSA-CHACHA20-POLY1305',

    // BTCPay Server serves lnd behind an nginx proxy with a trusted SSL cert from Lets Encrypt.
    // These certs use an RSA TLS cipher suite.
    'ECDHE-RSA-AES256-GCM-SHA384',
    'ECDHE-RSA-AES128-GCM-SHA256',
  ].join(':')
}

/**
 * @class ZapController
 *
 * The ZapController class coordinates actions between the the main nand renderer processes.
 */
class ZapController {
  mainWindow: BrowserWindow
  neutrino: Neutrino
  lightning: Lightning
  walletUnlocker: WalletUnlocker
  lndConfig: LndConfig
  fsm: StateMachine

  /**
   * Create a new ZapController instance.
   * @param {BrowserWindow} mainWindow BrowserWindow instance to interact with.
   */
  constructor(mainWindow: BrowserWindow) {
    // Variable to hold the main window instance.
    this.mainWindow = mainWindow
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
          { name: 'startOnboarding', from: '*', to: 'onboarding' },
          { name: 'startLocalLnd', from: 'onboarding', to: 'running' },
          { name: 'startRemoteLnd', from: 'onboarding', to: 'connected' },
          { name: 'stopLnd', from: '*', to: 'onboarding' },
          { name: 'terminate', from: '*', to: 'terminated' },
        ],
        methods: {
          onOnboarding: this.onOnboarding.bind(this),
          onStartOnboarding: this.onStartOnboarding.bind(this),
          onBeforeStartLocalLnd: this.onBeforeStartLocalLnd.bind(this),
          onBeforeStartRemoteLnd: this.onBeforeStartRemoteLnd.bind(this),
          onBeforeStopLnd: this.onBeforeStopLnd.bind(this),
          onTerminated: this.onTerminated.bind(this),
          onTerminate: this.onTerminate.bind(this),
        },
      })

      // Show the window as soon as the application has finished loading.
      this.mainWindow.show()
      this.mainWindow.focus()

      // Start the onboarding process.
      this.startOnboarding()
    })
  }

  // ------------------------------------
  // FSM Proxies
  // ------------------------------------

  startOnboarding(...args: any[]) {
    return this.fsm.startOnboarding(...args)
  }
  startLocalLnd(...args: any[]) {
    return this.fsm.startLocalLnd(...args)
  }
  startRemoteLnd(...args: any[]) {
    return this.fsm.startRemoteLnd(...args)
  }
  stopLnd(...args: any[]) {
    return this.fsm.stopLnd(...args)
  }
  terminate(...args: any[]) {
    return this.fsm.terminate(...args)
  }
  is(...args: any[]) {
    return this.fsm.is(...args)
  }
  can(...args: any[]) {
    return this.fsm.can(...args)
  }

  // ------------------------------------
  // FSM Callbacks
  // ------------------------------------

  async onOnboarding() {
    mainLog.debug('[FSM] onOnboarding...')

    // Remove any existing IPC listeners so that we can start fresh.
    this._removeIpcListeners()

    // Register IPC listeners so that we can react to instructions coming from the app.
    this._registerIpcListeners()

    // Disconnect from any existing lightning wallet connection.
    if (this.lightning && this.lightning.can('disconnect')) {
      this.lightning.disconnect()
    }
    if (this.walletUnlocker && this.walletUnlocker.can('disconnect')) {
      this.walletUnlocker.disconnect()
    }
    this.sendMessage('lndStopped')

    // Shut down Neutrino.
    await this.shutdownNeutrino()

    // Give the grpc connections a chance to be properly closed out.
    await delay(200)
  }

  onStartOnboarding() {
    mainLog.debug('[FSM] onStartOnboarding...')

    // Notify the app to start the onboarding process.
    this.sendMessage('startOnboarding')
  }

  onBeforeStartLocalLnd() {
    mainLog.debug('[FSM] onBeforeStartLocalLnd...')

    mainLog.info('Starting new lnd instance')
    mainLog.info(' > alias:', this.lndConfig.alias)
    mainLog.info(' > autopilot:', this.lndConfig.autopilot)

    return this.startNeutrino()
  }

  async onBeforeStartRemoteLnd() {
    mainLog.debug('[FSM] onBeforeStartRemoteLnd...')
    mainLog.info('Connecting to lnd:')
    mainLog.info(' > host:', this.lndConfig.host)
    mainLog.info(' > cert:', this.lndConfig.cert && truncate(this.lndConfig.cert))
    mainLog.info(' > macaroon:', this.lndConfig.macaroon && truncate(this.lndConfig.macaroon))

    try {
      await this.startLightningWallet()
    } catch (e) {
      /*
        In the GRPC API, there are 2 separate services:

        1) `WalletUnlocker`
        2) `Lightning`

        The `WalletUnlocker` is used for provisioning and unlocking wallets, and the `Lightning` service
        is used for interacting with unlocked wallets.

        Before we connect to lnd, we have no way to know what state the wallet is in, and therefore which
        service we need to connect to. The only way for us to find out is to try making a call against it.
        Only one of the services is available at any given time

        The `startLightningWallet` call attempts to call the `getInfo` method on the Lightning service in order to
        verify that it is accessible. If it is not, an error 12 is thrown which is the gRPC code for `UNIMPLEMENTED`
        which indicates that the requested operation is not implemented or not supported/enabled in the service.
        See https://github.com/grpc/grpc-node/blob/master/packages/grpc-native-core/src/constants.js#L129
      */

      const isSuccess = code => code === LND_METHOD_UNAVAILABLE

      // first check for the successful case
      if (isSuccess(e.code)) {
        // connection successful
        this.sendMessage('startLndSuccess')
        return this.startWalletUnlocker()
      }
      // error messages to help identify certain type of errors
      const MACAROON_ERROR_MESSAGES = [
        'cannot determine data format of binary-encoded macaroon',
        'verification failed: signature mismatch after caveat verification',
        'unmarshal v2: section extends past end of buffer',
      ]
      // else try to figure out the error
      const errors = {}
      if (e.code === LND_GRPC_HOST_ERROR) {
        errors.host = e.message
      }
      // There was a problem accessing the ssl cert.
      else if (e.code === LND_GRPC_CERT_ERROR) {
        errors.cert = e.message
      }
      //  There was a problem accessing the macaroon file.
      else if (e.code === LND_GRPC_MACAROON_ERROR || MACAROON_ERROR_MESSAGES.includes(e.message)) {
        errors.macaroon = e.message
      }
      // Other error codes such as UNAVAILABLE most likely indicate that there is a problem with the host.
      else {
        errors.host = `Unable to connect to host: ${e.details || e.message}`
      }

      // Notify the app of errors.
      this.sendMessage('startLndError', errors)
      throw e
    }
  }

  onBeforeStopLnd() {
    mainLog.debug('[FSM] onBeforeStopLnd...')
  }

  async onTerminated(lifecycle: any) {
    mainLog.debug('[FSM] onTerminated...')

    // Disconnect from any existing lightning wallet connection.
    if (lifecycle.from === 'connected') {
      if (this.lightning && this.lightning.can('disconnect')) {
        this.lightning.disconnect()
      }
      if (this.walletUnlocker && this.walletUnlocker.can('disconnect')) {
        this.walletUnlocker.disconnect()
      }
    }

    // Stop the Neutrino process.
    await this.shutdownNeutrino()
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
   * @param  {[type]} data additional data to accompany the message.
   */
  sendMessage(msg: string, data: any) {
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
   * Start the wallet unlocker.
   */
  async startWalletUnlocker() {
    mainLog.info('Establishing connection to Wallet Unlocker gRPC interface...')
    this.walletUnlocker = new WalletUnlocker(this.lndConfig)
    this.sendMessage('startWalletUnlocker', true)
    // Connect to the WalletUnlocker interface.
    try {
      await this.walletUnlocker.connect()

      // Listen for all gRPC restful methods and pass to gRPC.
      ipcMain.on('walletUnlocker', (event, { msg, data }) =>
        this.walletUnlocker.registerMethods(event, msg, data)
      )

      // Notify the renderer that the wallet unlocker is active.
      this.sendMessage('walletUnlockerStarted', this.lndConfig)
    } catch (err) {
      mainLog.warn('Unable to connect to WalletUnlocker gRPC interface: %o', err)
      throw err
    } finally {
      this.sendMessage('startWalletUnlocker', false)
    }
  }

  /**
   * Create and subscribe to the Lightning service.
   */
  async startLightningWallet() {
    mainLog.info('Establishing connection to Lightning gRPC interface...')
    this.lightning = new Lightning(this.lndConfig)
    // Connect to the Lightning interface.
    try {
      await this.lightning.connect()

      this.lightning.subscribe(this.mainWindow)

      // Listen for all gRPC restful methods and pass to gRPC.
      ipcMain.on('lnd', (event, { msg, data }) => this.lightning.registerMethods(event, msg, data))

      // Let the renderer know that we are connected.
      this.sendMessage('lightningWalletStarted', this.lndConfig)
    } catch (err) {
      mainLog.warn('Unable to connect to Lightning gRPC interface: %o', err)
      throw err
    }
  }

  /**
   * Starts the LND node and attach event listeners.
   * @return {Neutrino} Neutrino instance.
   */
  async startNeutrino() {
    mainLog.info('Starting Neutrino...')
    this.neutrino = new Neutrino(this.lndConfig)
    this.sendMessage('startNeutrino', true)
    this.neutrino.on('error', error => {
      mainLog.error(`Got error from lnd process: ${error})`)
      dialog.showMessageBox({
        type: 'error',
        message: `lnd error: ${error}`,
      })
    })

    this.neutrino.on('exit', (code, signal, lastError) => {
      mainLog.info(`Lnd process has shut down (code: ${code}, signal: ${signal})`)
      this.sendMessage('lndStopped')
      if (this.is('running')) {
        const messages = ['Lnd has unexpectedly quit']
        if (code) {
          messages.push(`Exit code: ${code}`)
        }
        if (signal) {
          messages.push(`Exit signal: ${signal}`)
        }
        if (lastError) {
          messages.push(`Last error: ${lastError}`)
        }
        this.sendMessage('receiveError', messages.join(' : '))
        this.stopLnd()
      }
    })

    this.neutrino.on('wallet-unlocker-grpc-active', () => {
      this.sendMessage('startNeutrino', false)
      mainLog.info('Wallet unlocker gRPC active')
      this.startWalletUnlocker()
    })

    this.neutrino.on('chain-sync-waiting', () => {
      this.sendMessage('startNeutrino', false)
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

    this.neutrino.on('got-lnd-cfilter-height', height => {
      this.sendMessage('lndCfilterHeight', Number(height))
    })

    try {
      const pid = await this.neutrino.start()
      this.sendMessage('lndStarted', this.lndConfig)
      return pid
    } catch (e) {
      // console.error(e)
    }
  }

  /**
   * Gracefully shutdown LND.
   */
  async shutdownNeutrino(options: shutdownOptions = {}) {
    const signal = options.signal || 'SIGINT'
    const timeout = options.timeout || 10000

    // We only want to shut down LND if we are running it locally.
    if (
      (this.lndConfig && this.lndConfig.type !== 'local') ||
      !this.neutrino ||
      !this.neutrino.process
    ) {
      return Promise.resolve()
    }

    mainLog.info('Shutting down Neutrino...')

    return new Promise(async resolve => {
      // HACK: Sometimes there are errors during the shutdown process that prevent the daemon from shutting down at
      // all. If we haven't received notification of the process closing within the timeout, kill it.
      // See https://github.com/lightningnetwork/lnd/pull/1781
      // See https://github.com/lightningnetwork/lnd/pull/1783
      const shutdownTimeout = setTimeout(() => {
        this.neutrino.removeListener('exit', exitHandler)
        if (this.neutrino) {
          mainLog.warn('Graceful shutdown failed to complete within 10 seconds.')
          this.neutrino.kill('SIGKILL')
          resolve()
        }
      }, timeout)

      const exitHandler = () => {
        clearTimeout(shutdownTimeout)
        resolve()
      }
      this.neutrino.once('exit', exitHandler)

      if (this.lightning && this.lightning.can('terminate')) {
        await this.lightning.disconnect()
      }
      if (this.walletUnlocker && this.walletUnlocker.can('disconnect')) {
        await this.walletUnlocker.disconnect()
      }

      // Kill the Neutrino process (sends SIGINT to Neutrino process)
      this.neutrino.kill(signal)
    }).then(() => mainLog.info('Neutrino shutdown complete'))
  }

  /**
   * Start or connect to lnd process after onboarding has been completed by the app.
   */
  async startLnd(options: LndConfigOptions) {
    mainLog.info(
      'Starting lnd with options: %o',
      sanitize(options, ['lndconnectUri', 'lndconnectQRCode'])
    )

    // Save the lnd config options that we got from the renderer.
    this.lndConfig = new LndConfig(options)

    // Wait for the config object to become ready.
    await this.lndConfig.isReady

    // Set up SSL with the cypher suits that we need.
    process.env.GRPC_SSL_CIPHER_SUITES = process.env.GRPC_SSL_CIPHER_SUITES || grpcSslCipherSuites()

    // If the requested connection type is a local one then start up a new lnd instance.
    // Otherwise attempt to connect to an lnd instance using user supplied connection details.
    return options.type === 'local' ? this.startLocalLnd() : this.startRemoteLnd()
  }

  /**
   * Add IPC event listeners...
   */
  _registerIpcListeners() {
    ipcMain.on('startLnd', async (event, options: LndConfigOptions) => {
      try {
        await this.startLnd(options)
      } catch (e) {
        mainLog.error('Unable to start lnd: %s', e.message)

        // Return back to the start of the onboarding process.
        return this.startOnboarding()
      }
    })
    ipcMain.on('startLightningWallet', async () => {
      try {
        await this.startLightningWallet()
      } catch (e) {
        mainLog.error('Unable to connect to lightning wallet: %s', e.message)

        // Notify the app of errors.
        this.sendMessage('startLndError', { host: e.message })

        // Return back to the start of the onboarding process.
        return this.startOnboarding()
      }
    })
    ipcMain.on('stopLnd', () => this.stopLnd())

    ipcMain.on('killLnd', async (event, options: shutdownOptions = {}) => {
      await this.shutdownNeutrino(options)
      event.sender.send('killLndSuccess')
    })

    ipcMain.on('generateLndConfig', async (event, options) => {
      const lndConfig = new LndConfig(options)
      await lndConfig.isReady
      // create a copy to ensure getters are serialized into flat props before sending
      // to the renderer process
      this.sendMessage('receiveLndConfig', Object.assign({}, lndConfig))
    })
  }

  /**
   * Add IPC event listeners...
   */
  _removeIpcListeners() {
    ipcMain.removeAllListeners('startLnd')
    ipcMain.removeAllListeners('stopLnd')
    ipcMain.removeAllListeners('killLnd')
    ipcMain.removeAllListeners('startLightningWallet')
    ipcMain.removeAllListeners('walletUnlocker')
    ipcMain.removeAllListeners('lnd')
    ipcMain.removeAllListeners('generateLndConfig')
  }
}

export default ZapController

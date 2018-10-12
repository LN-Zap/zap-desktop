/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 */
import { app, BrowserWindow, session } from 'electron'
import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS
} from 'electron-devtools-installer'
import { mainLog } from './lib/utils/log'
import ZapMenuBuilder from './lib/zap/menuBuilder'
import ZapController from './lib/zap/controller'
import ZapUpdater from './lib/zap/updater'

// Set up a couple of timers to track the app startup progress.
mainLog.time('Time until app is ready')

/**
 * Initialize Zap as soon as electron is ready.
 */
app.on('ready', () => {
  mainLog.timeEnd('Time until app is ready')

  // Create a new browser window.
  const mainWindow = new BrowserWindow({
    show: false,
    useContentSize: true,
    titleBarStyle: 'hidden',
    width: 950,
    height: 600,
    minWidth: 950,
    minHeight: 425,
    backgroundColor: '#1c1e26'
  })

  // Initialise the updater.
  const updater = new ZapUpdater(mainWindow)
  updater.init()

  // Initialise the application.
  const zap = new ZapController(mainWindow)
  zap.init()

  // Initialise the application menus.
  const menuBuilder = new ZapMenuBuilder(mainWindow)
  menuBuilder.buildMenu()

  /**
   * In production mode, enable source map support.
   */
  if (process.env.NODE_ENV === 'production') {
    const sourceMapSupport = require('source-map-support') // eslint-disable-line global-require
    sourceMapSupport.install()
  }

  /**
   * In development mode or when DEBUG_PROD is set, enable debugging tools.
   */
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    installExtension(REACT_DEVELOPER_TOOLS)
      .then(name => mainLog.debug(`Added Extension: ${name}`))
      .catch(err => mainLog.warn(`An error occurred when installing REACT_DEVELOPER_TOOLS: ${err}`))

    installExtension(REDUX_DEVTOOLS)
      .then(name => mainLog.debug(`Added Extension: ${name}`))
      .catch(err => mainLog.warn(`An error occurred when installing REDUX_DEVTOOLS: ${err}`))

    zap.mainWindow.webContents.once('dom-ready', () => {
      zap.mainWindow.openDevTools()
    })
  }

  /**
   * Add application event listener:
   *  - Open zap payment form when lightning url is opened
   */
  app.setAsDefaultProtocolClient('lightning')
  app.on('open-url', (event, url) => {
    mainLog.debug('open-url')
    event.preventDefault()
    const payreq = url.split(':')[1]
    zap.sendMessage('lightningPaymentUri', { payreq })
    zap.mainWindow.show()
  })

  // HACK: patch webrequest to fix devtools incompatibility with electron 2.x.
  // See https://github.com/electron/electron/issues/13008#issuecomment-400261941
  session.defaultSession.webRequest.onBeforeRequest({}, (details, callback) => {
    if (details.url.indexOf('7accc8730b0f99b5e7c0702ea89d1fa7c17bfe33') !== -1) {
      callback({
        redirectURL: details.url.replace(
          '7accc8730b0f99b5e7c0702ea89d1fa7c17bfe33',
          '57c9d07b416b5a2ea23d28247300e4af36329bdc'
        )
      })
    } else {
      callback({ cancel: false })
    }
  })

  /**
   * Add application event listener:
   *  - Stop gRPC and kill lnd process before the app windows are closed and the app quits.
   */
  app.on('before-quit', async event => {
    if (!zap.is('terminated')) {
      event.preventDefault()
      zap.terminate()
    } else {
      if (zap.mainWindow) {
        zap.mainWindow.forceClose = true
      }
    }
  })

  /**
   * On OS X it's common to re-open a window in the app when the dock icon is clicked.
   */
  app.on('activate', () => {
    zap.mainWindow.show()
  })
})

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 */
import { app, BrowserWindow, session } from 'electron'
import { mainLog } from './lib/utils/log'
import MenuBuilder from './lib/zap/menu'
import ZapController from './lib/zap/controller'
import lnd from './lib/lnd'

// Set up a couple of timers to track the app startup progress.
mainLog.time('Time until app is ready')
mainLog.time('Time until lnd process lookup finished')

// Determine wether we should start our own lnd process or connect to one that is already running.
const zapMode = lnd
  .isLndRunning()
  .then(res => {
    mainLog.debug('lnd already running: %s', res)
    mainLog.timeEnd('Time until lnd process lookup finished')
    return res ? 'external' : 'internal'
  })
  .catch(mainLog.error)

/**
 * Initialize Zap as soon as electron is ready.
 */
app.on('ready', () => {
  mainLog.timeEnd('Time until app is ready')

  // Start a couple more timers to track the app loading time.
  mainLog.time('Time until app is visible')
  mainLog.time('Time until onboarding has started')

  // Create the electron browser window.
  const mainWindow = new BrowserWindow({
    show: false,
    titleBarStyle: 'hidden',
    width: 950,
    height: 600,
    minWidth: 950,
    minHeight: 425,
    backgroundColor: '#1c1e26'
  })

  // Initialise the application.
  const zap = new ZapController(mainWindow, zapMode)
  zap.init()

  // Initialise the application menus.
  const menuBuilder = new MenuBuilder(mainWindow)
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
    // eslint-disable global-require
    require('electron-debug')()
    const installer = require('electron-devtools-installer')
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS
    const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS']

    Promise.all(extensions.map(name => installer.default(installer[name], forceDownload))).catch(
      mainLog.error
    )

    mainWindow.webContents.once('dom-ready', () => {
      mainWindow.openDevTools()
    })
  }

  /**
   * Add application event listener:
   *  - Kill lnd process is killed when the app quits.
   */
  app.on('quit', () => {
    mainLog.debug('app.quit')
    if (zap.neutrino) {
      zap.neutrino.stop()
    }
  })

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
    mainWindow.show()
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
   *  - quit app when window is closed
   */
  app.on('window-all-closed', () => {
    mainLog.debug('app.window-all-closed')
    // Respect the OSX convention of having the application in memory even after all windows have been closed
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
})

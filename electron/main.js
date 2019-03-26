/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build-main`, this file is compiled to
 * `/dist/main.prod.js` using webpack. This gives us some performance wins.
 */
import { app, BrowserWindow, session } from 'electron'
import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
} from 'electron-devtools-installer'
import get from 'lodash.get'
import path from 'path'
import os from 'os'
import fs from 'fs'
import bip21 from 'bip21'
import { mainLog } from '@zap/utils/log'
import themes from '@zap/renderer/themes'
import { getDbName } from '@zap/utils/db'
import ZapMenuBuilder from './menuBuilder'
import ZapController from './controller'
import ZapUpdater from './updater'
import ZapMigrator from './migrator'

// When we run in production mode, this file is processd with webpack and our config is made available in the
// global CONFIG object. If this is not set then we must be running in development mode (where this file is loaded
// directly without processing with webpack), so we require the config module directly in this case.
try {
  global.CONFIG = CONFIG
} catch (e) {
  global.CONFIG = require('config')
}

// Set the Electron userDir to a temporary directory if the ELECTRON_USER_DIR_TEMP env var is set.
// This provides an easy way to run the app with a completely fresh environment, useful for e2e tests.
if (process.env.ELECTRON_USER_DIR_TEMP) {
  const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'zap-'))
  mainLog.info('Using temporary directory %s for userData', folder)
  app.setPath('userData', folder)
}

// By default, run the app in development mode.
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development'
}

// Set up references to application helpers and controllers.
let zap
let updater
let menuBuilder
let mainWindow
let protocolUrl

// Set up a couple of timers to track the app startup progress.
mainLog.time('Time until app is ready')

/**
 * Handler for open-link events.
 */
const handleOpenUrl = (urlToOpen = '') => {
  // If we already have the mainWindow, handle the link right away.
  if (mainWindow) {
    mainLog.debug('handleOpenUrl: %s', urlToOpen)
    const type = urlToOpen.split(':')[0]

    switch (type) {
      case 'bitcoin':
        handleBitcoinLink(urlToOpen)
        break

      case 'lightning':
        handleLightningLink(urlToOpen)
        break

      case 'lndconnect':
        handleLndconnectLink(urlToOpen)
        break
    }
  }

  // Otherwise, defer until the winow content has fully loaded.
  // See mainWindow.webContents.on('did-finish-load') below.
  else {
    protocolUrl = urlToOpen
  }
}

/**
 * Handler for lndconnect: links
 */
const handleBitcoinLink = input => {
  try {
    const decoded = bip21.decode(input)
    zap.sendMessage('bitcoinPaymentUri', decoded)
    mainWindow.show()
  } catch (e) {
    mainLog.warn('Unable to process bitcoin uri: %s', e)
  }
}

/**
 * Handler for lightning: links
 */
const handleLightningLink = input => {
  const payReq = input.split(':')[1]
  zap.sendMessage('lightningPaymentUri', { payReq })
  mainWindow.show()
}

/**
 * Handler for lndconnect: links
 */
const handleLndconnectLink = input => {
  try {
    zap.sendMessage('lndconnectUri', input)
    mainWindow.show()
  } catch (e) {
    mainLog.warn('Unable to process lndconnect uri: %s', e)
  }
}

/**
 * Fetch user settings from indexedDb.
 * We do this by starting up a new browser window and accessing indexedDb from within it.
 */
const fetchSettings = () => {
  const win = new BrowserWindow({
    show: false,
    focusable: false,
    webPreferences: {
      nodeIntegration: false,
    },
  })
  if (process.env.HOT) {
    const port = process.env.PORT || 1212
    win.loadURL(`http://localhost:${port}/dist/empty.html`)
  } else {
    win.loadURL(`file://${__dirname}/empty.html`)
  }

  // Once we have fetched (or failed to fetch) the user settings, destroy the window.
  win.on('load-settings-done', () => process.nextTick(() => win.destroy()))

  const { namespace, domain } = global.CONFIG.db
  const { NODE_ENV: environment } = process.env
  const dbName = getDbName({
    namespace,
    domain,
    environment,
  })
  mainLog.debug(`Fetching user settings from indexedDb (using database "%s")`, dbName)

  return win.webContents
    .executeJavaScript(
      `
      new Promise((resolve, reject) => {
        var DBOpenRequest = window.indexedDB.open('${dbName}')
        DBOpenRequest.onupgradeneeded = function(event) {
          event.target.transaction.abort()
          return reject(new Error('Database does not exist'))
        }
        DBOpenRequest.onerror = function() {
          return reject(new Error('Error loading database'))
        }
        DBOpenRequest.onsuccess = function() {
          const db = DBOpenRequest.result
          var transaction = db.transaction(['settings'], 'readwrite')
          transaction.onerror = function() {
            return reject(transaction.error)
          }
          var objectStore = transaction.objectStore('settings')
          var objectStoreRequest = objectStore.getAll()
          objectStoreRequest.onsuccess = function() {
            return resolve(objectStoreRequest.result)
          }
        }
      })
    `
    )
    .then(res => {
      mainLog.debug('Got user settings: %o', res)
      win.emit('load-settings-done')
      return res
    })
    .catch(err => {
      win.emit('load-settings-done')
      throw err
    })
}

/**
 * Helper method to fetch a a settings property value.'
 */
const getSetting = (store, key) => {
  const setting = store.find(s => s.key === key)
  return setting && setting.hasOwnProperty('value') ? setting.value : null
}

/**
 * If we are not able to get a single instnace lock, quit immediately.
 */
const singleInstanceLock = app.requestSingleInstanceLock()
if (!singleInstanceLock) {
  mainLog.error('Unable to get single instance lock. It looks like you already have Zap open?')
  app.quit()
}

app.on('will-finish-launching', () => {
  app.on('open-url', (event, urlToOpen) => {
    mainLog.trace('app.open-url')
    event.preventDefault()
    handleOpenUrl(urlToOpen)
  })
})

/**
 * Initialize Zap as soon as electron is ready.
 */
app.on('ready', async () => {
  mainLog.trace('app.ready')
  mainLog.timeEnd('Time until app is ready')

  // Get the users preference so that we can:
  //  - set the background colour of the window to avoid unwanted flicker.
  //  - Initialise the Language menu with the users locale selected by default.
  let theme = {}
  let locale

  if (!process.env.DISABLE_INIT) {
    try {
      const settings = await fetchSettings()
      locale = getSetting(settings, 'locale')
      const themeKey = getSetting(settings, 'theme')
      theme = themes[themeKey]
    } catch (e) {
      mainLog.warn('Unable to determine user locale and theme', e)
    }
  }

  // Create a new browser window.
  mainWindow = new BrowserWindow({
    show: false,
    useContentSize: true,
    titleBarStyle: 'hidden',
    width: 900,
    height: 680,
    minWidth: 900,
    minHeight: 425,
    backgroundColor: get(theme, 'colors.primaryColor', '#242633'),
    webPreferences: {
      nodeIntegration: false,
      preload: process.env.HOT
        ? path.resolve(__dirname, '..', 'dist', 'preload.dev.js')
        : path.resolve(__dirname, 'preload.prod.js'),
    },
  })

  // Initialise the migrator and run any pending migrations.
  if (!process.env.DISABLE_INIT) {
    const migrator = new ZapMigrator()
    await migrator.up()
  }

  // Initialise the updater.
  updater = new ZapUpdater(mainWindow)
  updater.init()

  // Initialise the application.
  zap = new ZapController(mainWindow)
  zap.init()

  // Initialise the application menus.
  menuBuilder = new ZapMenuBuilder(mainWindow)
  menuBuilder.buildMenu(locale)

  /**
   * Add application event listener:
   *  - Stop gRPC and kill lnd process before the app windows are closed and the app quits.
   */
  app.on('before-quit', event => {
    mainLog.trace('app.before-quit')
    if (zap.is('terminated')) {
      if (mainWindow) {
        mainWindow.forceClose = true
      }
    } else {
      event.preventDefault()
      zap.terminate()
    }
  })

  app.on('will-quit', () => {
    mainLog.trace('app.will-quit')
  })

  app.on('quit', () => {
    mainLog.trace('app.quit')
  })

  /**
   * On OS X it's common to re-open a window in the app when the dock icon is clicked.
   */
  app.on('activate', () => {
    mainLog.trace('app.activate')
    mainWindow.show()
  })

  app.on('window-all-closed', () => {
    mainLog.trace('app.window-all-closed')
    if (os.platform() !== 'darwin' || mainWindow.forceClose) {
      app.quit()
    }
  })

  /**
   * Someone tried to run a second instance, we should focus our window.
   */
  app.on('second-instance', (event, commandLine) => {
    mainLog.trace('app.second-instance')
    if (os.platform() !== 'darwin') {
      const urlToOpen = commandLine && commandLine.slice(1)[0]
      if (urlToOpen) {
        handleOpenUrl(urlToOpen)
      }
    }
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore()
      }
      mainWindow.focus()
    }
  })

  // When the window is closed, just hide it unless we are force closing.
  mainWindow.on('close', event => {
    mainLog.trace('mainWindow.close')
    if (os.platform() === 'darwin' && !mainWindow.forceClose) {
      event.preventDefault()
      mainWindow.hide()
    }
  })

  // Dereference the window object.
  mainWindow.on('closed', () => {
    mainLog.trace('mainWindow.closed')
    mainWindow = null
    updater.mainWindow = null
    zap.mainWindow = null
    menuBuilder.mainWindow = null
  })

  // Once the app has finished loading, handle any deferred protocol urls.
  mainWindow.webContents.on('did-finish-load', () => {
    mainLog.trace('webContents.did-finish-load')

    // Check to see if we have a protocol link to handle from app startup time.
    // On the mac, `protocolUrl` will be set as a result of us trying to process the link from the `open-url` handler.
    // On windows/linux the link will be passed to electron as the first process argument.
    const urlToOpen = protocolUrl || process.argv.slice(1)[0]
    if (urlToOpen) {
      handleOpenUrl(urlToOpen)
      protocolUrl = null
    }
  })

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
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD) {
    installExtension(REACT_DEVELOPER_TOOLS)
      .then(name => mainLog.debug(`Added Extension: ${name}`))
      .catch(err => mainLog.warn(`An error occurred when installing REACT_DEVELOPER_TOOLS: ${err}`))

    installExtension(REDUX_DEVTOOLS)
      .then(name => mainLog.debug(`Added Extension: ${name}`))
      .catch(err => mainLog.warn(`An error occurred when installing REDUX_DEVTOOLS: ${err}`))

    mainWindow.webContents.once('dom-ready', () => {
      mainLog.trace('webContents.dom-ready')
      mainWindow.openDevTools()
    })
  }

  // HACK: patch webrequest to fix devtools incompatibility with electron 2.x.
  // See https://github.com/electron/electron/issues/13008#issuecomment-400261941
  session.defaultSession.webRequest.onBeforeRequest({}, (details, callback) => {
    if (details.url.indexOf('7accc8730b0f99b5e7c0702ea89d1fa7c17bfe33') === -1) {
      callback({ cancel: false })
    } else {
      callback({
        redirectURL: details.url.replace(
          '7accc8730b0f99b5e7c0702ea89d1fa7c17bfe33',
          '57c9d07b416b5a2ea23d28247300e4af36329bdc'
        ),
      })
    }
  })
})

// ------------------------------------
// Helpers
// ------------------------------------

/**
 * Add application event listeners:
 *  - lightning: Open zap payment form when bitcoin url is opened
 *  - lightning: Open zap payment form when lightning url is opened
 *  - lndconnect: Populate onboarding connection details form when lndconnect url is opened
 */
app.setAsDefaultProtocolClient('bitcoin')
app.setAsDefaultProtocolClient('lightning')
app.setAsDefaultProtocolClient('lndconnect')

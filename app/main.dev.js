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
import get from 'lodash.get'
import path from 'path'
import { mainLog } from './lib/utils/log'
import ZapMenuBuilder from './lib/zap/menuBuilder'
import ZapController from './lib/zap/controller'
import ZapUpdater from './lib/zap/updater'
import themes from './themes'
import { getDbName } from './store/db'

// Set up a couple of timers to track the app startup progress.
mainLog.time('Time until app is ready')

/**
 * Fetch user settings from indexedDb.
 * We do this by starting up a new browser window and accessing indexedDb from within it.
 *
 * @return {[type]} 'settings' store from indexedDb.
 */
const fetchSettings = () => {
  const win = new BrowserWindow({ show: false, focusable: false })
  if (process.env.HOT) {
    const port = process.env.PORT || 1212
    win.loadURL(`http://localhost:${port}/dist/empty.html`)
  } else {
    win.loadURL(`file://${__dirname}/dist/empty.html`)
  }

  // Once we have fetched (or failed to fetch) the user settings, destroy the window.
  win.on('load-settings-done', () => process.nextTick(() => win.destroy()))

  const dbName = getDbName()
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

const getSetting = (store, key) => {
  const setting = store.find(s => s.key === key)
  return setting && setting.hasOwnProperty('value') ? setting.value : null
}

/**
 * Initialize Zap as soon as electron is ready.
 */
app.on('ready', async () => {
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
  const mainWindow = new BrowserWindow({
    show: false,
    useContentSize: true,
    titleBarStyle: 'hidden',
    width: 1020,
    height: 680,
    minWidth: 900,
    minHeight: 425,
    backgroundColor: get(theme, 'colors.primaryColor', '#242633'),
    webPreferences: {
      preload: path.resolve(__dirname, './preload.js')
    }
  })

  // Initialise the updater.
  const updater = new ZapUpdater(mainWindow)
  updater.init()

  // Initialise the application.
  const zap = new ZapController(mainWindow)
  zap.init()

  // Initialise the application menus.
  const menuBuilder = new ZapMenuBuilder(mainWindow)
  menuBuilder.buildMenu(locale)

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
    const payReq = url.split(':')[1]
    zap.sendMessage('lightningPaymentUri', { payReq })
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

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build-main`, this file is compiled to
 * `/dist/main.js` using webpack. This gives us some performance wins.
 */
import fs from 'fs'
import os from 'os'
import path from 'path'

import bip21 from 'bip21'
import config from 'config'
import { app, session, BrowserWindow } from 'electron'
import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
} from 'electron-devtools-installer'
import isDev from 'electron-is-dev'
import get from 'lodash/get'

import themes from '@zap/renderer/themes'
import appRootPath from '@zap/utils/appRootPath'
import { parseLnUrl } from '@zap/utils/lnurl'
import { mainLog } from '@zap/utils/log'

import ZapController from './controller'
import LnurlService from './lnurl'
import ZapMenuBuilder from './menuBuilder'
import ZapMigrator from './migrator'
import createPDFGeneratorService from './pdfGenerator/service'
import createStorageService from './secureStorage'
import ZapUpdater from './updater'
import fetchSettings from './utils/fetchSettings'
import createBackupService from './walletBackup/service'

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
let lnurlService

// Set up a couple of timers to track the app startup progress.
mainLog.time('Time until app is ready')

/**
 * handleBitcoinLink - Handler for bitcoin: links.
 *
 * @param {string} input Bitcoin link
 */
const handleBitcoinLink = input => {
  mainLog.info('Attempting to process bitcoin uri: %s', input)
  try {
    const decoded = bip21.decode(input)
    zap.sendMessage('bitcoinPaymentUri', decoded)
  } catch (e) {
    mainLog.warn('Unable to process bitcoin uri: %s', e)
  } finally {
    mainWindow.show()
  }
}

/**
 * handleLnurlLink - Handler for lightning lnurl links.
 *
 * @param {string} input lnurl string
 */
const handleLnurlLink = async input => {
  mainLog.info('Processing lightning uri as lnurl: %s', input)
  try {
    await lnurlService.process(input)
  } catch (e) {
    mainLog.warn('Unable to process lnurl uri: %s', e.message)
  } finally {
    mainWindow.show()
  }
}

/**
 * handleLninvoiceLink - Handler for lightning invoice links.
 *
 * @param {string} address payment request
 */
const handleLninvoiceLink = address => {
  mainLog.info('Processing lightning uri as lninvoice: %s', address)
  try {
    zap.sendMessage('lightningPaymentUri', { address })
  } catch (e) {
    mainLog.warn('Unable to process lightning uri: %s', e.message)
  } finally {
    mainWindow.show()
  }
}

/**
 * handleLightningLink - Handler for lightning: links.
 *
 * @param {string} fullUrl Lightning request
 */
const handleLightningLink = fullUrl => {
  mainLog.info('Attempting to process lightning uri: %s', fullUrl)
  try {
    const [, url] = fullUrl.split(':')
    const lnurl = parseLnUrl(url)
    if (lnurl) {
      handleLnurlLink(lnurl)
    } else {
      handleLninvoiceLink(url)
    }
  } catch (e) {
    mainLog.warn('Unable to process lightning uri: %s', e.message)
  }
}

/**
 * handleLndconnectLink - Handler for lndconnect: links.
 *
 * @param {string} input LndConnect link
 */
const handleLndconnectLink = input => {
  try {
    zap.sendMessage('lndconnectUri', input)
  } catch (e) {
    mainLog.warn('Unable to process lndconnect uri: %s', e.message)
  } finally {
    mainWindow.show()
  }
}

const protocolHandlers = {
  bitcoin: handleBitcoinLink,
  lightning: handleLightningLink,
  lndconnect: handleLndconnectLink,
}

/**
 * handleOpenUrl - Handler for open-link events.
 *
 * @param {string} urlToOpen Url to open
 */
const handleOpenUrl = (urlToOpen = '') => {
  // If we already have the mainWindow, handle the link right away.
  if (mainWindow) {
    mainLog.debug('handleOpenUrl: %s', urlToOpen)
    const [protocol] = urlToOpen.split(':')
    const handler = protocolHandlers[protocol]
    handler && handler(urlToOpen)
  }
  // Otherwise, defer until the window content has fully loaded.
  // See mainWindow.webContents.on('did-finish-load') below.
  else {
    protocolUrl = urlToOpen
  }
}

/**
 * getSetting - Helper method to fetch a a settings property value.
 *
 * @param {object} store dexie `settings` key/value table
 * @param {string} key Key of setting to to fetch
 * @returns {any|null} Value of fetched setting
 */
const getSetting = (store, key) => {
  const setting = store.find(s => s.key === key)
  return setting ? get(setting, 'value', null) : null
}

/**
 * singleInstanceLock - If we are not able to get a single instance lock, quit immediately.
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
  //  - Initialize the Language menu with the users locale selected by default.
  //  - Enable auto updates based on user preferences.
  let autoupdate = {}
  let theme = {}
  let locale = null

  if (!process.env.DISABLE_INIT) {
    try {
      const settings = await fetchSettings()
      const currentConfig = getSetting(settings, 'config') || {}
      const themeKey = currentConfig.theme || config.theme
      locale = currentConfig.locale || config.locale
      autoupdate = currentConfig.autoupdate || config.autoupdate
      theme = themes[themeKey]
    } catch (e) {
      mainLog.warn('Unable to determine user settings: %s', e.message)
    }
  }

  // Create a new browser window.
  mainWindow = new BrowserWindow({
    show: false,
    useContentSize: true,
    titleBarStyle: 'hidden',
    width: 950,
    height: 720,
    minWidth: 900,
    minHeight: 500,
    backgroundColor: get(theme, 'colors.primaryColor', '#242633'),
    icon: isDev
      ? path.resolve('resources', 'icon.png')
      : path.resolve(appRootPath(), 'resources', 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
      nodeIntegrationInWorker: true,
      preload: isDev
        ? path.resolve(__dirname, '..', 'dist', 'preload.js')
        : path.resolve(__dirname, 'preload.js'),
    },
  })

  // Initialize the migrator and run any pending migrations.
  if (!process.env.DISABLE_INIT) {
    const migrator = new ZapMigrator()
    await migrator.up()
  }

  // Initialize the updater.
  updater = new ZapUpdater(mainWindow, autoupdate)

  // Initialize the application.
  zap = new ZapController(mainWindow)
  zap.init({ theme: theme ? theme.name : undefined })

  // Initialize the application menus.
  menuBuilder = new ZapMenuBuilder(mainWindow)
  menuBuilder.buildMenu(locale)

  // Initialize backup system.
  createBackupService(mainWindow)

  // Initialize secure storage service.
  createStorageService(mainWindow)

  // Initialize pdf generator service.
  createPDFGeneratorService(mainWindow)

  lnurlService = new LnurlService(mainWindow)

  /**
   * Add application event listener:
   *  - Stop gRPC and kill lnd process before the app windows are closed and the app quits.
   */
  app.on('before-quit', event => {
    mainLog.trace('app.before-quit')
    if (mainWindow && !mainWindow.forceClose) {
      event.preventDefault()
      mainWindow.forceClose = true
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
    // Tries to find protocol link among cmd line params
    const getUrl = () => {
      const protocols = Object.keys(protocolHandlers)
      const isKnownProtocol = value => protocols.find(p => value.indexOf(`${p}:`) === 0)
      return commandLine.find((value, index) => index > 0 && isKnownProtocol(value))
    }
    mainLog.trace('app.second-instance')
    // handler for macOS is done via 'open-url' event handling
    if (os.platform() !== 'darwin') {
      const urlToOpen = commandLine && getUrl()
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
    // On Mac, when the user closes the window we just want to hide it so that they can open from the dock later.
    if (os.platform() === 'darwin') {
      if (!mainWindow.forceClose) {
        event.preventDefault()
        if (mainWindow.isFullScreen()) {
          mainWindow.once('leave-full-screen', () => {
            mainWindow.hide()
          })
          mainWindow.setFullScreen(false)
        } else {
          mainWindow.hide()
        }
      }
    }
    // On Windows/Linux, we quit the app when the window is closed.
    else if (!mainWindow.forceClose) {
      event.preventDefault()
      mainWindow.hide()
      app.quit()
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
    if (process.env.REINSTALL_DEVTOOLS) {
      session.removeExtension(REACT_DEVELOPER_TOOLS)
      session.removeExtension(REDUX_DEVTOOLS)
    }

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

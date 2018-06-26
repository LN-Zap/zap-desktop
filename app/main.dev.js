/* eslint global-require: 1, flowtype-errors/show-errors: 0 */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 *
 */
import { app, BrowserWindow, ipcMain, dialog, session } from 'electron'
import path from 'path'
import fs from 'fs'
import split2 from 'split2'
import { spawn } from 'child_process'
import { lookup } from 'ps-node'
import Store from 'electron-store'
import MenuBuilder from './menu'
import lnd from './lnd'
import config from './lnd/config'
import { mainLog, lndLog, lndLogGetLevel } from './utils/log'

let mainWindow = null

let didFinishLoad = false

let startedSync = false
let sentGrpcDisconnect = false

let neutrino = null

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support')
  sourceMapSupport.install()
}

if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
  require('electron-debug')()
  const p = path.join(__dirname, '..', 'app', 'node_modules')
  require('module').globalPaths.push(p)
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer')
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS']

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(mainLog.error)
}

// Send the front end event letting them know the gRPC connection is disconnected
const sendGrpcDisconnected = () => {
  const sendGrpcDisonnectedInterval = setInterval(() => {
    if (didFinishLoad) {
      clearInterval(sendGrpcDisonnectedInterval)

      if (mainWindow) {
        sentGrpcDisconnect = true
        mainWindow.webContents.send('grpcDisconnected')
      }
    }
  }, 1000)
}

// Send the front end event letting them know LND is synced to the blockchain
const sendLndSyncing = () => {
  const sendLndSyncingInterval = setInterval(() => {
    if (didFinishLoad) {
      clearInterval(sendLndSyncingInterval)

      if (mainWindow) {
        mainLog.info('SENDING SYNCING')
        startedSync = true
        mainWindow.webContents.send('lndSyncing')
      }
    }
  }, 1000)
}

const sendStartOnboarding = () => {
  const sendStartOnboardingInterval = setInterval(() => {
    if (didFinishLoad) {
      clearInterval(sendStartOnboardingInterval)

      if (mainWindow) {
        mainLog.info('STARTING ONBOARDING')
        mainWindow.webContents.send('startOnboarding')
      }
    }
  }, 1000)
}

// Send the front end event letting them know the gRPC connection has started
const sendGrpcConnected = () => {
  const sendGrpcConnectedInterval = setInterval(() => {
    if (didFinishLoad && sentGrpcDisconnect) {
      clearInterval(sendGrpcConnectedInterval)

      if (mainWindow) {
        mainWindow.webContents.send('grpcConnected')
      }
    }
  }, 1000)
}

// Create and subscribe the grpc object
const startGrpc = () => {
  lnd.initLnd((lndSubscribe, lndMethods) => {
    // Subscribe to bi-directional streams
    lndSubscribe(mainWindow)

    // Listen for all gRPC restful methods
    ipcMain.on('lnd', (event, { msg, data }) => {
      lndMethods(event, msg, data)
    })

    sendGrpcConnected()
  })
}

// Create and subscribe the grpc object
const startWalletUnlocker = () => {
  lnd.initWalletUnlocker(walletUnlockerMethods => {
    // Listen for all gRPC restful methods
    ipcMain.on('walletUnlocker', (event, { msg, data }) => {
      walletUnlockerMethods(event, msg, data)
    })
  })

  mainWindow.webContents.send('walletUnlockerStarted')
}

// Send the front end event letting them know LND is synced to the blockchain
const sendLndSynced = () => {
  const sendLndSyncedInterval = setInterval(() => {
    if (didFinishLoad && startedSync) {
      clearInterval(sendLndSyncedInterval)

      if (mainWindow) {
        mainLog.info('SENDING SYNCED')
        mainWindow.webContents.send('lndSynced')
      }
    }
  }, 1000)
}

// Starts the LND node
const startLnd = (alias, autopilot) => {
  const lndConfig = config.lnd()
  mainLog.info('STARTING BUNDLED LND')
  mainLog.debug(' > lndPath', lndConfig.lndPath)
  mainLog.debug(' > lightningRpc:', lndConfig.lightningRpc)
  mainLog.debug(' > lightningHost:', lndConfig.lightningHost)
  mainLog.debug(' > cert:', lndConfig.cert)
  mainLog.debug(' > macaroon:', lndConfig.macaroon)

  const neutrinoArgs = [
    `--configfile=${lndConfig.configPath}`,
    `${autopilot ? '--autopilot.active' : ''}`,
    `${alias ? `--alias=${alias}` : ''}`
  ]

  neutrino = spawn(lndConfig.lndPath, neutrinoArgs)
    .on('error', error => {
      lndLog.error(`lnd error: ${error}`)
      dialog.showMessageBox({
        type: 'error',
        message: `lnd error: ${error}`
      })
    })
    .on('close', code => {
      lndLog.info(`lnd shutting down ${code}`)
      app.quit()
    })

  // Listen for when neutrino prints odata to stderr.
  neutrino.stderr.pipe(split2()).on('data', line => {
    if (process.env.NODE_ENV === 'development') {
      lndLog[lndLogGetLevel(line)](line)
    }
  })

  // Listen for when neutrino prints data to stdout.
  neutrino.stdout.pipe(split2()).on('data', line => {
    if (process.env.NODE_ENV === 'development') {
      lndLog[lndLogGetLevel(line)](line)
    }

    // If the gRPC proxy has started we can start ours
    if (line.includes('gRPC proxy started')) {
      const certInterval = setInterval(() => {
        if (fs.existsSync(lndConfig.cert)) {
          clearInterval(certInterval)

          mainLog.info('CERT EXISTS, STARTING WALLET UNLOCKER')
          startWalletUnlocker()

          if (mainWindow) {
            mainWindow.webContents.send('walletUnlockerStarted')
          }
        }
      }, 1000)
    }

    if (line.includes('gRPC proxy started') && !line.includes('password')) {
      mainLog.info('WALLET OPENED, STARTING LIGHTNING GRPC CONNECTION')
      sendLndSyncing()
      startGrpc()
    }

    // Pass current clock height progress to front end for loading state UX
    if (
      mainWindow &&
      (line.includes('Caught up to height') || line.includes('Catching up block hashes to height'))
    ) {
      // const blockHeight = line.slice(line.indexOf('Caught up to height') + 'Caught up to height'.length).trim()
      mainWindow.webContents.send('lndStdout', line)
    }

    // When LND is all caught up to the blockchain
    if (line.includes('Chain backend is fully synced')) {
      // Log that LND is caught up to the current block height
      mainLog.info('NEUTRINO IS SYNCED')

      // Let the front end know we have stopped syncing LND
      sendLndSynced()
    }
  })
}

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('ready', async () => {
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    await installExtensions()
  }

  mainWindow = new BrowserWindow({
    show: false,
    titleBarStyle: 'hidden',
    width: 950,
    height: 600,
    minWidth: 950,
    minHeight: 425
  })

  if (process.env.HOT) {
    const port = process.env.PORT || 1212
    mainWindow.loadURL(`http://localhost:${port}/dist/index.html`)
  } else {
    mainWindow.loadURL(`file://${__dirname}/dist/index.html`)
  }

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined')
    }

    mainWindow.show()
    mainWindow.focus()

    // now sync and grpc events can be fired to the front end
    didFinishLoad = true
  })

  mainWindow.on('closed', () => {
    mainWindow = null

    // shut down zap when a user closes the window
    app.quit()
  })

  const menuBuilder = new MenuBuilder(mainWindow)
  menuBuilder.buildMenu()

  sendGrpcDisconnected()

  mainLog.info('LOOKING FOR EXISTING LND PROCESS')
  // Check to see if an LND process is running.
  lookup({ command: 'lnd' }, (err, results) => {
    // There was an error checking for the LND process.
    if (err) {
      throw new Error(err)
    }

    if (!results.length) {
      // An LND process was found, no need to start our own.
      mainLog.info('EXISTING LND PROCESS NOT FOUND')
      // Let the application know onboarding has started.
      sendStartOnboarding()
    } else {
      // An LND process was found, no need to start our own.
      mainLog.info('FOUND EXISTING LND PROCESS')
      startGrpc()
      mainWindow.webContents.send('successfullyCreatedWallet')
    }
  })

  // Start LND
  // once the onboarding has enough information, start or connect to LND.
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

    mainLog.info('GOT LND CONFIG')
    mainLog.debug(' > connectionType:', options.connectionType)
    mainLog.debug(' > connectionHost:', options.connectionHost)
    mainLog.debug(' > connectionCert:', options.connectionCert)
    mainLog.debug(' > connectionMacaroon:', options.connectionMacaroon)
    mainLog.debug(' > alias:', options.alias)
    mainLog.debug(' > autopilot:', options.autopilot)

    mainLog.info('SAVED LND CONFIG TO:', store.path)

    if (options.connectionType === 'local') {
      startLnd(options.alias, options.autopilot)
    } else {
      mainLog.info('CONNECTING TO CUSTOM LND INSTANCE')
      startGrpc()
      mainWindow.webContents.send('successfullyCreatedWallet')
    }
  })

  // HACK: patch webrequest to fix devtools incompatibility with electron 2.x.
  // See https://github.com/electron/electron/issues/13008#issuecomment-400261941
  session.defaultSession.webRequest.onBeforeRequest({}, (details, callback) => {
    if (details.url.indexOf('hack') !== -1) {
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
})

app.setAsDefaultProtocolClient('lightning')

app.on('open-url', (event, url) => {
  event.preventDefault()

  if (!mainWindow) {
    throw new Error('"mainWindow" is not defined')
  }

  const payreq = url.split(':')[1]
  mainWindow.webContents.send('lightningPaymentUri', { payreq })
  mainWindow.show()
})

// Ensure lnd process is killed when the app quits.
app.on('quit', () => {
  if (neutrino) {
    neutrino.kill()
  }
})

export default { startLnd }

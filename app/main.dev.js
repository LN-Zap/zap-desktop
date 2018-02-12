/* eslint global-require: 1, flowtype-errors/show-errors: 0 */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import fs from 'fs'
import { spawn } from 'child_process'
import { lookup } from 'ps-node'
import os from 'os'
import MenuBuilder from './menu'
import lnd from './lnd'

const plat = os.platform()
const homedir = os.homedir()
let mainWindow = null

let didFinishLoad = false

let startedSync = false
let sentGrpcDisconnect = false

let certPath

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
  const extensions = [
    'REACT_DEVELOPER_TOOLS',
    'REDUX_DEVTOOLS'
  ]

  return Promise
    .all(extensions.map(name => installer.default(installer[name], forceDownload)))
    .catch(console.log)
}

// Send the front end event letting them know the gRPC connection has started
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
        console.log('SENDING SYNCING')
        startedSync = true
        mainWindow.webContents.send('lndSyncing')
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
  lnd((lndSubscribe, lndMethods) => {
    // Subscribe to bi-directional streams
    lndSubscribe(mainWindow)

    // Listen for all gRPC restful methods
    ipcMain.on('lnd', (event, { msg, data }) => {
      lndMethods(event, msg, data)
    })

    sendGrpcConnected()
  })
}

// Send the front end event letting them know LND is synced to the blockchain
const sendLndSynced = () => {
  const sendLndSyncedInterval = setInterval(() => {
    if (didFinishLoad && startedSync) {
      clearInterval(sendLndSyncedInterval)

      if (mainWindow) {
        console.log('SENDING SYNCED')
        mainWindow.webContents.send('lndSynced')
      }
    }
  }, 1000)
}

// Starts the LND node
const startLnd = () => {
  let lndPath

  if (process.env.NODE_ENV === 'development') {
    lndPath = path.join(__dirname, '..', 'resources', 'bin', plat, plat === 'win32' ? 'lnd.exe' : 'lnd')
  } else {
    lndPath = path.join(__dirname, '..', 'bin', plat === 'win32' ? 'lnd.exe' : 'lnd')
  }

  if (!fs.existsSync(lndPath)) {
    console.log(`ERROR: lnd file not found at: ${lndPath}`)
    console.log('Make sure you have downloaded the appropiate lnd file to the proper directory.')
    console.log('See README for download links and installation instructions.')
    return app.quit()
  }

  try {
    fs.accessSync(lndPath, fs.constants.X_OK)
  } catch (err) {
    console.log('ERROR: lnd file does not have execute permissions')
    console.log(`Run: chmod +x on ${lndPath}`)
    return app.quit()
  }

  const neutrino = spawn(lndPath,
    [
      '--bitcoin.active',
      '--bitcoin.testnet',
      '--bitcoin.node=neutrino',
      '--neutrino.connect=btcd.jackmallers.com:18333',
      '--neutrino.addpeer=188.166.148.62:18333',
      '--neutrino.addpeer=159.65.48.139:18333',
      '--neutrino.connect=127.0.0.1:18333',
      '--autopilot.active',
      '--debuglevel=debug',
      '--noencryptwallet'
    ]
  )
    .on('error', error => console.log(`lnd error: ${error}`))
    .on('close', (code) => {
      console.log(`lnd shutting down ${code}`)
      console.log('Make sure you are using latest lnd from -> https://github.com/LN-Zap/zap-desktop/releases')
      console.log('App will now QUIT')
      app.quit()
    })

  // Listen for when neutrino prints out data
  neutrino.stdout.on('data', (data) => {
    // Data stored in variable line, log line to the console
    const line = data.toString('utf8')

    if (process.env.NODE_ENV === 'development') { console.log(line) }

    // If the gRPC proxy has started we can start ours
    if (line.includes('gRPC proxy started')) {
      const certInterval = setInterval(() => {
        if (fs.existsSync(certPath)) {
          clearInterval(certInterval)

          console.log('CERT EXISTS, STARTING GRPC')
          startGrpc()
        }
      }, 1000)
    }

    // Pass current clock height progress to front end for loading state UX
    if (mainWindow && (line.includes('Caught up to height') || line.includes('Catching up block hashes to height'))) {
      // const blockHeight = line.slice(line.indexOf('Caught up to height') + 'Caught up to height'.length).trim()
      mainWindow.webContents.send('lndStdout', line)
    }

    // When LND is all caught up to the blockchain
    if (line.includes('Chain backend is fully synced')) {
      // Log that LND is caught up to the current block height
      console.log('NEUTRINO IS SYNCED')

      // Let the front end know we have stopped syncing LND
      sendLndSynced()
    }
  })

  return null
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

  mainWindow.loadURL(`file://${__dirname}/app.html`)

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
  // Check to see if and LND process is running
  lookup({ command: 'lnd' }, (err, results) => {
    // There was an error checking for the LND process
    if (err) { throw new Error(err) }

    // No LND process was found
    if (!results.length) {
      // Assign path to certs to certPath
      sendLndSyncing()

      switch (os.platform()) {
        case 'darwin':
          certPath = path.join(homedir, 'Library/Application Support/Lnd/tls.cert')
          break
        case 'linux':
          certPath = path.join(homedir, '.lnd/tls.cert')
          break
        case 'win32':
          certPath = path.join(homedir, 'AppData', 'Local', 'Lnd', 'tls.cert')
          break
        default:
          break
      }

      // Start LND
      startLnd()
    } else {
      // An LND process was found, no need to start our own
      console.log('LND ALREADY RUNNING')
      startGrpc()
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

export default { startLnd }

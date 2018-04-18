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

const sendStartOnboarding = () => {
  const sendStartOnboardingInterval = setInterval(() => {
    if (didFinishLoad) {
      clearInterval(sendStartOnboardingInterval)

      if (mainWindow) {
        console.log('STARTING ONBOARDING')
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
  lnd.initWalletUnlocker((walletUnlockerMethods) => {
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
        console.log('SENDING SYNCED')
        mainWindow.webContents.send('lndSynced')
      }
    }
  }, 1000)
}

// Starts the LND node
const startLnd = (alias, autopilot) => {
  let lndPath

  if (process.env.NODE_ENV === 'development') {
    lndPath = path.join(__dirname, '..', 'resources', 'bin', plat, plat === 'win32' ? 'lnd.exe' : 'lnd')
  } else {
    lndPath = path.join(__dirname, '..', 'bin', plat === 'win32' ? 'lnd.exe' : 'lnd')
  }

  const neutrinoArgs = [
    '--bitcoin.active',
    '--bitcoin.testnet',
    '--bitcoin.node=neutrino',
    '--neutrino.connect=188.166.148.62',
    '--neutrino.connect=127.0.0.1:18333',
    '--debuglevel=debug',
    `${autopilot ? '--autopilot.active' : ''}`,
    `${alias ? `--alias=${alias}` : ''}`
  ]

  const neutrino = spawn(lndPath, neutrinoArgs)
    .on('error', error => console.log(`lnd error: ${error}`))
    .on('close', code => console.log(`lnd shutting down ${code}`))

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

          console.log('CERT EXISTS, STARTING WALLET UNLOCKER')
          startWalletUnlocker()

          if (mainWindow) {
            mainWindow.webContents.send('walletUnlockerStarted')
          }
        }
      }, 1000)
    }

    if (line.includes('gRPC proxy started') && !line.includes('password')) {
      console.log('WALLET OPENED, STARTING LIGHTNING GRPC CONNECTION')
      sendLndSyncing()
      startGrpc()
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

  // Check to see if we should use an external LND address
  if (process.env.LND_HOST_PORT) {
    // An LND process was found, no need to start our own
    console.log(`USING EXTERNALLY RUNNING LND AT ADDRESS ${process.env.LND_HOST_PORT}`)
    startGrpc()
    return
  }

  // Check to see if an LND process is running
  lookup({ command: 'lnd' }, (err, results) => {
    // There was an error checking for the LND process
    if (err) { throw new Error(err) }

    // No LND process was found
    if (!results.length) {
      // let the application know onboarding has started
      sendStartOnboarding()

      // Assign path to certs to certPath
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
      // once the onboarding has finished we wanna let the application we have started syncing and start LND
      ipcMain.on('startLnd', (event, { alias, autopilot }) => {
        startLnd(alias, autopilot)
      })
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

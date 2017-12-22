/* eslint-disable */
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
let certInterval


if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
  require('electron-debug')();
  const path = require('path');
  const p = path.join(__dirname, '..', 'app', 'node_modules');
  require('module').globalPaths.push(p);
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = [
    'REACT_DEVELOPER_TOOLS',
    'REDUX_DEVTOOLS'
  ];

  return Promise
    .all(extensions.map(name => installer.default(installer[name], forceDownload)))
    .catch(console.log);
};


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
    await installExtensions();
  }

  let icon = path.join(__dirname, '..', 'resources', 'icon.icns')
  console.log('icon: ', icon)
  mainWindow = new BrowserWindow({
    show: false,
    frame: false,
    nodeIntegration: false,
    icon: icon
  })

  mainWindow.maximize()

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
    mainWindow = null;
  })

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu()

  sendGrpcDisconnected()
  // Check to see if and LND process is running
  lookup({ command: 'lnd' }, (err, results) => {
    // There was an error checking for the LND process
    if (err) { throw new Error( err ) }

    // No LND process was found
    if (!results.length) {
      // Assign path to certs to certPath
      sendLndSyncing()

      switch (os.platform()) {
        case 'darwin':
          certPath = path.join(homedir, 'Library/Application\ Support/Lnd/tls.cert')
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
});

app.setAsDefaultProtocolClient('lightning')

app.on('open-url', function (event, url) {
  event.preventDefault()

  if (!mainWindow) {
    throw new Error('"mainWindow" is not defined')
  }

  const payreq = url.split(':')[1]
  mainWindow.webContents.send('lightningPaymentUri', { payreq })
  mainWindow.show()
})

// Starts the LND node
export const startLnd = () => {
  const lndPath = path.join(__dirname, '..', 'resources', 'bin', plat, plat === 'win32' ? 'lnd.exe' : 'lnd')

  const neutrino = spawn(lndPath,
      [
        '--bitcoin.active',
        '--bitcoin.testnet',
        '--neutrino.active',
        '--neutrino.connect=btcd0.lightning.computer:18333',
        '--neutrino.connect=faucet.lightning.community:18333',
        '--autopilot.active',
        '--debuglevel=debug',
        '--noencryptwallet'
      ]
    )
      .on('error', error => console.log(`lnd error: ${error}`))
      .on('close', code => console.log(`lnd shutting down ${code}`))

  // Listen for when neutrino prints out data
  neutrino.stdout.on('data', data => {
    // Data stored in variable line, log line to the console
    let line = data.toString('utf8')

    if (process.env.NODE_ENV === 'development') { console.log(line) }

    // If the gRPC proxy has started we can start ours
    if (line.includes('gRPC proxy started')) {
      let certInterval = setInterval(() => {
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
      const blockHeight = line.slice(line.indexOf('Caught up to height') + 'Caught up to height'.length).trim()
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
const sendLndSyncing = () => {
  let sendLndSyncingInterval = setInterval(() => {
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

// Send the front end event letting them know LND is synced to the blockchain
const sendLndSynced = () => {
  let sendLndSyncedInterval = setInterval(() => {
    if (didFinishLoad && startedSync) {
      clearInterval(sendLndSyncedInterval)

      if (mainWindow) {
        console.log('SENDING SYNCED')
        mainWindow.webContents.send('lndSynced')
      }
    }
  }, 1000)
}

// Send the front end event letting them know the gRPC connection has started
const sendGrpcDisconnected = () => {
  let sendGrpcDisonnectedInterval = setInterval(() => {
    if (didFinishLoad) {
      clearInterval(sendGrpcDisonnectedInterval)

      if (mainWindow) {
        sentGrpcDisconnect = true
        mainWindow.webContents.send('grpcDisconnected')
      }
    }
  }, 1000)
}

// Send the front end event letting them know the gRPC connection has started
const sendGrpcConnected = () => {
  let sendGrpcConnectedInterval = setInterval(() => {
    if (didFinishLoad && sentGrpcDisconnect) {
      clearInterval(sendGrpcConnectedInterval)

      if (mainWindow) {
        mainWindow.webContents.send('grpcConnected')
      }
    }
  }, 1000)
}

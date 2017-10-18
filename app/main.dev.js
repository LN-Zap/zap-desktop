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
import fs from 'fs'
import path from 'path'
import { spawn, exec } from 'child_process'
import { lookup } from 'ps-node'
import { platform } from 'os'
import MenuBuilder from './menu'
import lnd from './lnd'

let mainWindow = null
let neutrino = null
let syncing = false


if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
  require('electron-debug')();
  const path = require('path');
  const p = path.join(__dirname, '..', 'app', 'node_modules');
  require('module').globalPaths.push(p);

  // set icon
  // app.dock.setIcon(`${path.join(__dirname, '..', 'resources')}/zap_2.png`)
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
    app.quit();
  }
});


app.on('ready', async () => {
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    frame: false
  });

  mainWindow.maximize();

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined')
    }
    
    mainWindow.show()
    mainWindow.focus()

    if (syncing) {
      mainWindow.webContents.send('lndSyncing')
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null;
  })

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu()

  // Check to see if and LND process is running
  lookup({ command: 'lnd' }, (err, results) => {
    // There was an error checking for the LND process
    if (err) { throw new Error( err ) }

    // No LND process was found
    if (!results.length) {
      // Run a bash script that checks for the LND folder and generates Node.js compatible certs
      console.log('CHECKING/GENERATING CERTS')
      exec(`sh ${path.join(__dirname, '..', 'resources', 'scripts', 'darwin_generate_certs.sh')}`)
      // exec(`echo > certs.txt`)
      // exec("mkdir -p ~/Library/Application\ Support/Lnd;")
      // exec("openssl ecparam -genkey -name prime256v1 -out ~/Library/Application\ Support/Lnd/tls.key")
      // exec("openssl req -new -sha256 -key ~/Library/Application\ Support/Lnd/tls.key -out ~/Library/Application\ Support/Lnd/csr.csr -subj '/CN=localhost/O=lnd'")
      // exec("openssl req -x509 -sha256 -days 3650 -key ~/Library/Application\ Support/Lnd/tls.key -in ~/Library/Application\ Support/Lnd/csr.csr -out ~/Library/Application\ Support/Lnd/tls.cert")
      // exec("rm ~/Library/Application\ Support/Lnd/csr.csr")

      
      // After the certs are generated, it's time to start LND
      console.log('STARTING LND')
      const lndPath = path.join(__dirname, '..', 'resources', 'bin', 'darwin', 'darwin' === 'win32' ? 'lnd.exe' : 'lnd')
      console.log('lndPath: ', lndPath)
      neutrino = spawn(lndPath,
        [
          '--bitcoin.active',
          '--bitcoin.testnet',
          '--neutrino.active',
          '--neutrino.connect=faucet.lightning.community:18333',
          '--autopilot.active',
          '--debuglevel=debug',
          '--no-macaroons'
        ]
      )
        .on('error', error => console.log(`lnd error: ${error}`))
        .on('close', code => console.log(`lnd shutting down ${code}`))

      // exec(`echo > lnd.txt`)

      // Let the front end know we have started syncing LND
      syncing = true

      // Listen for when neutrino prints out data
      neutrino.stdout.on('data', data => {
        // Data stored in variable line, log line to the console
        let line = data.toString('utf8')
        console.log(line)

        // Pass current clock height progress to front end for loading state UX
        if (line.includes('Caught up to height')) {
          const blockHeight = line.slice(line.indexOf('Caught up to height') + 'Caught up to height'.length).trim()
          mainWindow.webContents.send('lndStdout', blockHeight)
        }

        // When LND is all caught up to the blockchain
        if (line.includes('Done catching up block hashes')) {
          // Log that LND is caught up to the current block height
          console.log('DONE CATCHING UP BLOCK HASHES')
          // Call lnd
          lnd((lndSubscribe, lndMethods) => {
            // Subscribe to bi-directional streams
            lndSubscribe(mainWindow)

            // Listen for all gRPC restful methods
            ipcMain.on('lnd', (event, { msg, data }) => {
              lndMethods(event, msg, data)
            })

            // Let the front end know we have stopped syncing LND
            syncing = false
            mainWindow.webContents.send('lndSynced')
          })
        }
      })
    } else {
      // An LND process was found, no need to start our own
      console.log('LND ALREADY RUNNING')
      // Call lnd
      lnd((lndSubscribe, lndMethods) => {
        // Subscribe to bi-directional streams
        lndSubscribe(mainWindow)

        // Listen for all gRPC restful methods
        ipcMain.on('lnd', (event, { msg, data }) => {
          lndMethods(event, msg, data)
        })
      })
    }
  })
})

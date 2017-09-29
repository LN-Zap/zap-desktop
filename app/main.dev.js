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
import { spawn, exec } from 'child_process'
import { lookup } from 'ps-node'
import MenuBuilder from './menu'
import lnd from './lnd'

let mainWindow = null
let neutrino = null

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support')
  sourceMapSupport.install()
}

if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
  require('electron-debug')()
  const path = require('path')
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
    frame: false
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
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  const menuBuilder = new MenuBuilder(mainWindow)
  menuBuilder.buildMenu()


  //Set ENV variables for go binaries
  process.env.GOPATH = "~/gocode"
  process.env.PATH = process.env.PATH + ":" + process.env.HOME + "/gocode/bin"
  exec("chmod +x pre_run.sh & ./pre_run.sh")

  // Check to see if LND is running. If not, start it.
  lookup({ command: 'lnd' }, (err, results) => {
    if (err) { throw new Error( err ) }

    if (!results.length) {
      // Alert user that LND is starting
      console.log('STARTING LND')

      // Start LND
      neutrino = spawn(
        'lnd',
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

      // Alert user when LND is shutting down
      neutrino.on('close', code => console.log(`lnd shutting down ${code}`))

    } else {
      console.log('LND ALREADY RUNNING')
    }
  })
})

ipcMain.on('lnd', (event, { msg, data }) => {
  lnd(event, msg, data)
})

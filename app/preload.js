/**
 * When running `npm run build` or `npm run build-preload`, this file is compiled to
 * `./app/dist/preload.prod.js` using webpack.
 */
import { ipcRenderer, remote, shell } from 'electron'
import fs from 'fs'
import { join } from 'path'
import { promisify } from 'util'
import assert from 'assert'
import url from 'url'
import untildify from 'untildify'
import rimraf from 'rimraf'
import { validateHost } from './lib/utils/validateHost'

const fsReadFile = promisify(fs.readFile)
const fsReaddir = promisify(fs.readdir)
const fsRimraf = promisify(rimraf)

/**
 * Reference to the require method for Spectron to access (see e2e tests)
 * @type {Array}
 */
if (process.env.NODE_ENV === 'test') {
  window.electronRequire = require
}

/**
 * List of domains that we will allow users to be redirected to.
 * @type {Array}
 */
const WHITELISTED_DOMAINS = [
  'ln-zap.github.io',
  'blockstream.info',
  'testnet.litecore.io',
  'litecore.io'
]

/**
 * List of environment variables that we want to make available.
 * @type {Array}
 */
const WHITELISTED_ENV_VARS = ['DEBUG', 'DEBUG_LEVEL', 'DEBUG_PROD', 'NODE_ENV', 'HOT']

/**
 * Open an external web page. Only allow whitelisted domains.
 */
function openExternal(urlString) {
  const parsedUrl = url.parse(urlString)
  if (!parsedUrl.hostname) {
    return
  }
  if (WHITELISTED_DOMAINS.includes(parsedUrl.hostname)) {
    shell.openExternal(urlString)
  }
}

/**
 * Open the help page in a new browser window.
 */
function openHelpPage() {
  openExternal('https://ln-zap.github.io/zap-tutorials/zap-desktop-getting-started')
}

/**
 * Get a list of local wallets from the filesystem.
 */
async function getLocalWallets(chain, network) {
  try {
    assert(chain && network)
    const walletDir = join(remote.app.getPath('userData'), 'lnd', chain, network)
    return await fsReaddir(walletDir)
  } catch (err) {
    return []
  }
}

function killLnd() {
  return new Promise(resolve => {
    ipcRenderer.once('killLndSuccess', resolve)
    ipcRenderer.send('killLnd', { signal: 'SIGKILL', timeout: 2500 })
  })
}

/**
 * Delete a local wallet from the filesystem.
 */
async function deleteLocalWallet(chain, network, wallet, force = false) {
  try {
    assert(chain && network && wallet)
  } catch (err) {
    throw new Error(`Unknown wallet: (chain: ${chain}, network: ${network}, wallet: ${wallet}`)
  }

  let walletDir = join(remote.app.getPath('userData'), 'lnd', chain, network, wallet)

  if (force) {
    return await fsRimraf(walletDir, { disableGlob: true })
  }

  return new Promise((resolve, reject) => {
    remote.dialog.showMessageBox(
      {
        /* eslint-disable max-len */
        type: 'warning',
        message: 'Are you sure you want to delete this wallet?',
        detail: `Deleting this wallet will remove all data from the wallet directory:\n\n${walletDir}\n\nThis action cannot be undone!\n\nPlease ensure that you have access to your wallet backup seed before proceeding.`,
        checkboxLabel: `Yes, delete this wallet`,
        cancelId: 1,
        buttons: ['Delete', 'Cancel'],
        defaultId: 0
      },
      async (choice, checkboxChecked) => {
        if (choice === 0) {
          if (checkboxChecked) {
            try {
              await fsRimraf(walletDir, { disableGlob: true })
              return resolve()
            } catch (e) {
              return reject(new Error(`There was a problem deleting wallet: ${e.message}`))
            }
          } else {
            return reject(
              new Error(
                'The wallet was not deleted as you did not select the confirmation checkbox.'
              )
            )
          }
        } else {
          return reject(new Error('The wallet was not deleted.'))
        }
      }
    )
  })
}

/**
 * Check that a file exists.
 * @param {string} path Path of file to check gor existance.
 * @returns {Promise<Boolean>}
 */
async function fileExists(path) {
  return fsReadFile(untildify(path))
}

function getUserDataDir() {
  return remote.app.getPath('userData')
}

// Expose a bridging API to by setting an global on `window`.
//
// !CAREFUL! do not expose any functionality or APIs that could compromise the
// user's computer. E.g. don't directly expose core Electron (even IPC) or node.js modules.
window.Zap = {
  openExternal,
  openHelpPage,
  getLocalWallets,
  deleteLocalWallet,
  getUserDataDir,
  validateHost,
  fileExists,
  killLnd
}

// Provide access to ipcRenderer.
window.ipcRenderer = ipcRenderer

// Provide access to whitelisted environment variables.
window.env = Object.keys(process.env)
  .filter(key => WHITELISTED_ENV_VARS.includes(key))
  .reduce((obj, key) => {
    obj[key] = process.env[key]
    return obj
  }, {})

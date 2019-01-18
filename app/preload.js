/**
 * When running `npm run build` or `npm run build-preload`, this file is compiled to
 * `./app/dist/preload.prod.js` using webpack.
 */
const { ipcRenderer, remote, shell } = require('electron')
const { readdir } = require('fs')
const { join } = require('path')
const { promisify } = require('util')
const assert = require('assert')
const url = require('url')
const fs = require('fs')
const dns = require('dns')
const untildify = require('untildify')
const rimraf = require('rimraf')
const isFQDN = require('validator/lib/isFQDN')
const isIP = require('validator/lib/isIP')
const isPort = require('validator/lib/isPort')

const dnsLookup = promisify(dns.lookup)
const fsReadFile = promisify(fs.readFile)
const fsReaddir = promisify(readdir)
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
  return ipcRenderer.sendSync('killLnd')
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
 * Helper function to check a hostname in the format hostname:port is valid for passing to node-grpc.
 * @param {string} host A hostname + optional port in the format [hostname]:[port?]
 * @returns {Promise<Boolean>}
 */
async function validateHost(host) {
  const splits = host.split(':')
  const lndHost = splits[0]
  const lndPort = splits[1]

  // If the hostname starts with a number, ensure that it is a valid IP address.
  if (!isFQDN(lndHost, { require_tld: false }) && !isIP(lndHost)) {
    const error = new Error(`${lndHost} is not a valid IP address or hostname`)
    error.code = 'LND_GRPC_HOST_ERROR'
    return Promise.reject(error)
  }

  // If the host includes a port, ensure that it is a valid.
  if (lndPort && !isPort(lndPort)) {
    const error = new Error(`${lndPort} is not a valid port`)
    error.code = 'LND_GRPC_HOST_ERROR'
    return Promise.reject(error)
  }

  // Do a DNS lookup to ensure that the host is reachable.
  return dnsLookup(lndHost)
    .then(() => true)
    .catch(e => {
      const error = new Error(`${lndHost} is not accessible: ${e.message}`)
      error.code = 'LND_GRPC_HOST_ERROR'
      return Promise.reject(error)
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

// Expose a bridging API to by setting an global on `window`.
//
// !CAREFUL! do not expose any functionality or APIs that could compromise the
// user's computer. E.g. don't directly expose core Electron (even IPC) or node.js modules.
window.Zap = {
  openExternal,
  openHelpPage,
  getLocalWallets,
  deleteLocalWallet,
  validateHost,
  fileExists,
  killLnd
}

// Provide access to ipcRenderer.
window.ipcRenderer = ipcRenderer
//Provide access to electron remote
window.showOpenDialog = remote.dialog.showOpenDialog

// Provide access to whitelisted environment variables.
window.env = Object.keys(process.env)
  .filter(key => WHITELISTED_ENV_VARS.includes(key))
  .reduce((obj, key) => {
    obj[key] = process.env[key]
    return obj
  }, {})

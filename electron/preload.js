/**
 * When running `npm run build` or `npm run build-preload`, this file is compiled to
 * `/dist/preload.js` using webpack.
 */
import { ipcRenderer, remote, shell } from 'electron'
import fs from 'fs'
import { join } from 'path'
import { promisify } from 'util'
import assert from 'assert'
import url from 'url'
import untildify from 'untildify'
import rimraf from 'rimraf'
import isSubDir from '@zap/utils/isSubDir'
import { getAllLocalWallets } from '@zap/utils/localWallets'
import lndBinaryPath from '@zap/utils/lndBinaryPath'
import lndGrpcProtoDir from '@zap/utils/lndGrpcProtoDir'
import validateHost from '@zap/utils/validateHost'
import splitHostname from '@zap/utils/splitHostname'
import LndConfig from '@zap/utils/lndConfig'

const fsReadFile = promisify(fs.readFile)
const fsRimraf = promisify(rimraf)

/**
 * List of domains that we will allow users to be redirected to.
 * @type {Array}
 */
const WHITELISTED_DOMAINS = [
  'coinfaucet.eu',
  'ln-zap.github.io',
  'blockstream.info',
  'testnet.litecore.io',
  'litecore.io',
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
 * Open a testnet faucet in a new browser window.
 */
function openTestnetFaucet() {
  openExternal('https://coinfaucet.eu/en/btc-testnet/')
}

function killNeutrino(signal) {
  return new Promise(resolve => {
    ipcRenderer.once('killNeutrinoSuccess', resolve)
    ipcRenderer.send('killNeutrino', signal)
  })
}

/**
 * Generates an lnd config object from a wallet config.
 * @param  {Object} wallet Wallet config
 * @return {Object}        Lnd config
 */
async function generateLndConfigFromWallet(wallet) {
  // Convert wallet config to lnd config.
  wallet.decoder = wallet.decoder || 'lnd.lndconnect.v1'

  const lndConfig = new LndConfig({
    ...wallet,
    userDataDir: getUserDataDir(),
    binaryPath: lndBinaryPath(),
    protoDir: lndGrpcProtoDir(),
  })

  // Wait for the config to become fully initialized.
  await lndConfig.isReady

  // lndConfig is an LndConfig class instance that contains methods and properties that are promises such as the
  // `isReady` prop used above. We convert this to a plain object so that we can store in Redux and freely pass
  // between the renderer and Web Worker processes without needing to proxy. This also flattens getter method
  // properties to plan props.
  return Object.assign({}, lndConfig)
}

/**
 * Returns specified wallet files location
 * @param {*} chain
 * @param {*} network
 * @param {*} wallet
 */
function getWalletDir(chain, network, wallet) {
  return join(remote.app.getPath('userData'), 'lnd', chain, network, wallet)
}

/**
 * Delete a local wallet from the filesystem.
 * @param {Object} location - wallet location desc
 * @param {string} location.chain - chain
 * @param {string} location.network - network
 * @param {string} location.wallet - wallet id
 * @param {string} location.dir - Direct location
 * Must either specify @dir or @chain and @network and @wallet
 */
async function deleteLocalWallet({ chain, network, wallet, dir }) {
  // returns wallet location based on arguments configuration
  const getDir = () => {
    if (typeof dir === 'string') {
      return dir
    }

    try {
      assert(chain && network && wallet)
      return getWalletDir(chain, network, wallet)
    } catch (err) {
      throw new Error(`Unknown wallet: (chain: ${chain}, network: ${network}, wallet: ${wallet}`)
    }
  }

  try {
    const walletDir = getDir()
    // for security considerations make sure dir we are removing is actually a wallet dir
    if (!isSubDir(join(remote.app.getPath('userData'), 'lnd'), walletDir)) {
      throw new Error('Invalid directory specified')
    }
    return fsRimraf(walletDir, { disableGlob: true })
  } catch (e) {
    throw new Error(`There was a problem deleting wallet: ${e.message}`)
  }
}

/**
 * Check that a file exists.
 * @param {string} path Path of file to check gor existence.
 * @returns {Promise<Boolean>}
 */
async function fileExists(path) {
  return fsReadFile(untildify(path))
}

function getUserDataDir() {
  return remote.app.getPath('userData')
}

// Provide access to whitelisted environment variables.
window.env = Object.keys(process.env)
  .filter(key => WHITELISTED_ENV_VARS.includes(key))
  .reduce((obj, key) => {
    obj[key] = process.env[key]
    return obj
  }, {})

// Expose a bridging API to by setting an global on `window`.
//
// !CAREFUL! do not expose any functionality or APIs that could compromise the
// user's computer. E.g. don't directly expose core Electron (even IPC) or node.js modules.
window.Zap = {
  openExternal,
  openHelpPage,
  openTestnetFaucet,
  generateLndConfigFromWallet,
  getWalletDir,
  getAllLocalWallets,
  deleteLocalWallet,
  getUserDataDir,
  validateHost,
  fileExists,
  killNeutrino,
  splitHostname,
}

// Provide access to ipcRenderer.
window.ipcRenderer = ipcRenderer

//Provide access to electron remote
window.showOpenDialog = remote.dialog.showOpenDialog

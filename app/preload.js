const { remote, shell } = require('electron')
const { readdir } = require('fs')
const { join } = require('path')
const { promisify } = require('util')
const rimraf = require('rimraf')
const assert = require('assert')

const fsReaddir = promisify(readdir)
const fsRimraf = promisify(rimraf)

init()

function init() {
  // Expose a bridging API to by setting an global on `window`.
  //
  // !CAREFUL! do not expose any functionality or APIs that could compromise the
  // user's computer. E.g. don't directly expose core Electron (even IPC) or node.js modules.
  window.Zap = {
    openHelpPage,
    getLocalWallets,
    deleteLocalWallet
  }
}

/**
 * Open the help page in a new browser window.
 */
function openHelpPage() {
  shell.openExternal('https://ln-zap.github.io/zap-tutorials/zap-desktop-getting-started')
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

/**
 * Delete a local wallet from the filesystem.
 */
async function deleteLocalWallet(chain, network, wallet) {
  try {
    assert(chain && network && wallet)
  } catch (err) {
    throw new Error(`Unknown wallet: (chain: ${chain}, network: ${network}, wallet: ${wallet}`)
  }

  const walletDir = join(remote.app.getPath('userData'), 'lnd', chain, network, wallet)
  return await fsRimraf(walletDir)
}

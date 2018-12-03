const { remote, shell } = require('electron')
const { readdir } = require('fs')
const { join } = require('path')
const { promisify } = require('util')

const fsReaddir = promisify(readdir)

init()

function init() {
  // Expose a bridging API to by setting an global on `window`.
  //
  // !CAREFUL! do not expose any functionality or APIs that could compromise the
  // user's computer. E.g. don't directly expose core Electron (even IPC) or node.js modules.
  window.Zap = {
    openHelpPage,
    getLocalWallets
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
async function getLocalWallets(chain = 'bitcoin', network = 'testnet') {
  const walletDir = join(remote.app.getPath('userData'), 'lnd', chain, network)
  try {
    return await fsReaddir(walletDir)
  } catch (err) {
    return []
  }
}

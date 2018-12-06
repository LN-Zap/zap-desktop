const { remote, shell } = require('electron')
const { readdir } = require('fs')
const { join } = require('path')
const { promisify } = require('util')
const rimraf = require('rimraf')
const assert = require('assert')
const url = require('url')

const fsReaddir = promisify(readdir)
const fsRimraf = promisify(rimraf)

const WHITELISTED_DOMAINS = ['ln-zap.github.io', 'blockstream.info']

init()

function init() {
  // Expose a bridging API to by setting an global on `window`.
  //
  // !CAREFUL! do not expose any functionality or APIs that could compromise the
  // user's computer. E.g. don't directly expose core Electron (even IPC) or node.js modules.
  window.Zap = {
    openExternal,
    openHelpPage,
    getLocalWallets,
    deleteLocalWallet
  }
}

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
            await fsRimraf(walletDir)
            return resolve()
          } else {
            remote.dialog.showErrorBox(
              'Wallet not deleted',
              'The wallet was not deleted as you did not select the confirmation checkbox.'
            )
          }
        } else {
          return reject()
        }
      }
    )
  })
}

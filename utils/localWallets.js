import assert from 'assert'
import { readdir, existsSync } from 'fs'
import { join } from 'path'
import { promisify } from 'util'

import electron, { remote } from 'electron'
import rimraf from 'rimraf'

import isSubDir from '@zap/utils/isSubDir'

const fsReaddir = promisify(readdir)
const fsRimraf = promisify(rimraf)

const app = electron.app || remote.app

/**
 * getWalletDir - Returns specified wallet files location.
 *
 * @param {string} chain Chain
 * @param {string} network Network
 * @param {string} wallet Wallet
 * @returns {string} Path to wallet directory
 */
export function getWalletDir(chain, network, wallet = '') {
  const res = join(app.getPath('userData'), `lnd/${chain}/${network}/${wallet}`)
  return res
}

/**
 * getLocalWallets - Get a list of local wallets from the filesystem for a given chain/network.
 *
 * @param {string} chain Chain name
 * @param {string} network Network name
 * @returns {Array} List of wallets
 */
export async function getLocalWallets(chain, network) {
  try {
    assert(chain && network)
    const walletDir = getWalletDir(chain, network)
    const wallets = await fsReaddir(walletDir)
    // Look for tls.cert file inside wallet dir to consider it a wallet candidate.
    const isWalletDir = wallet => existsSync(join(walletDir, wallet, 'tls.cert'))
    return wallets.filter(isWalletDir).map(wallet => ({
      type: 'local',
      chain,
      network,
      wallet,
    }))
  } catch (err) {
    return []
  }
}

/**
 * getAllLocalWallets - Get a list of local wallets from the filesystem.
 *
 * @param {Array} chains = [] List of chain names
 * @param {Array} networks = [] List of network names
 * @returns {Array} List of local wallets matching chains and networks
 */
export async function getAllLocalWallets(chains = [], networks = []) {
  const configs = []
  chains.forEach(chain => {
    networks.forEach(network => {
      configs.push({
        chain,
        network,
      })
    })
  })
  let res = []
  for (const config of configs) {
    const { chain, network } = config
    const wallets = await getLocalWallets(chain, network) // eslint-disable-line no-await-in-loop
    res = res.concat(wallets)
  }

  return res
}

/**
 * purgeLocalWallet - Purge a local wallet (triggers a resync).
 *
 * @param {string} chain Chain name
 * @param {string} network Network name
 * @param {string} wallet Wallet name
 * @returns {Promise} Promise
 */
export async function purgeLocalWallet(chain, network, wallet) {
  assert(chain && network && wallet)
  const walletDir = join(app.getPath('userData'), 'lnd', chain, network, wallet)
  await fsRimraf(join(walletDir, 'data/chain', chain, network, '*.bin'))
}

/**
 * purgeAllLocalWallets - Purge all local wallets (triggers a resync).
 *
 * @param {Array} chains = [] list of chain names
 * @param {Array} networks = [] list of network names
 * @returns {Promise} Promise
 */
export async function purgeAllLocalWallets(chains = [], networks = []) {
  const wallets = await getAllLocalWallets(chains, networks)
  for (const wallet of wallets) {
    await purgeLocalWallet(wallet.chain, wallet.network, wallet.wallet) // eslint-disable-line no-await-in-loop
  }
}

/**
 * deleteLocalWallet - Delete a local wallet from the filesystem.
 *
 * @param {object} location - wallet location desc
 * @param {string} location.chain - chain
 * @param {string} location.network - network
 * @param {string} location.wallet - wallet id
 * @param {string} location.dir - Direct location
 * @returns {undefined}
 */
export async function deleteLocalWallet({ chain, network, wallet, dir }) {
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
    if (!isSubDir(join(app.getPath('userData'), 'lnd'), walletDir)) {
      throw new Error('Invalid directory specified')
    }
    return fsRimraf(walletDir, { disableGlob: true })
  } catch (e) {
    throw new Error(`There was a problem deleting wallet: ${e.message}`)
  }
}

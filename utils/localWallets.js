import electron, { remote } from 'electron'
import { promisify } from 'util'
import assert from 'assert'
import { join } from 'path'
import { readdir, existsSync } from 'fs'
import rimraf from 'rimraf'

const fsReaddir = promisify(readdir)
const fsRimraf = promisify(rimraf)

/**
 * getLocalWallets - Get a list of local wallets from the filesystem for a given chain/network.
 *
 * @param  {string} chain Chain name
 * @param  {string} network Network name
 * @returns {Array} List of wallets
 */
export async function getLocalWallets(chain, network) {
  try {
    assert(chain && network)
    const app = electron.app || remote.app
    const walletDir = join(app.getPath('userData'), 'lnd', chain, network)
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
 * @param  {Array} chains = [] List of chain names
 * @param  {Array} networks = [] List of network names
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
    const wallets = await getLocalWallets(chain, network)
    res = res.concat(wallets)
  }

  return res
}

/**
 * purgeLocalWallet - Purge a local wallet (triggers a resync).
 *
 * @param  {string} chain Chain name
 * @param  {string} network Network name
 * @param  {string} wallet Wallet name
 * @returns {Promise} Promise
 */
export async function purgeLocalWallet(chain, network, wallet) {
  assert(chain && network && wallet)
  const app = electron.app || remote.app
  const walletDir = join(app.getPath('userData'), 'lnd', chain, network, wallet)
  await fsRimraf(join(walletDir, 'data/chain', chain, network, '*.bin'))
}

/**
 * purgeAllLocalWallets - Purge all local wallets (triggers a resync).
 *
 * @param  {Array} chains = [] list of chain names
 * @param  {Array} networks = [] list of network names
 * @returns {Promise} Promise
 */
export async function purgeAllLocalWallets(chains = [], networks = []) {
  const wallets = await getAllLocalWallets(chains, networks)
  for (const wallet of wallets) {
    await purgeLocalWallet(wallet.chain, wallet.network, wallet.wallet)
  }
}

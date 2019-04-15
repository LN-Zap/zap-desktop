import electron, { remote } from 'electron'
import { promisify } from 'util'
import assert from 'assert'
import { join } from 'path'
import { readdir, existsSync } from 'fs'
import rimraf from 'rimraf'

const fsReaddir = promisify(readdir)
const fsRimraf = promisify(rimraf)

/**
 * Get a list of local wallets from the filesystem for a given chain/network.
 */
export async function getLocalWallets(chain, network) {
  try {
    assert(chain && network)
    const app = electron.app || remote.app
    const walletDir = join(app.getPath('userData'), 'lnd', chain, network)
    const wallets = await fsReaddir(walletDir)

    // Look for tls.cert file inside wallet dir to consider it a wallet candidate
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
 * Get a list of local wallets from the filesystem.
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
 * Purge a local wallet (triggers a resync)
 */
export async function purgeLocalWallet(chain, network, wallet) {
  assert(chain && network && wallet)
  const app = electron.app || remote.app
  const walletDir = join(app.getPath('userData'), 'lnd', chain, network, wallet)
  await fsRimraf(join(walletDir, 'data/chain', chain, network, '*.bin'))
}

/**
 * Purge all local wallets (triggers a resync)
 */
export async function purgeAllLocalWallets(chains = [], networks = []) {
  const wallets = await getAllLocalWallets(chains, networks)
  for (const wallet of wallets) {
    await purgeLocalWallet(wallet.chain, wallet.network, wallet.wallet)
  }
}

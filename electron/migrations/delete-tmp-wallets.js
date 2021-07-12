import config from 'config'

import { getAllLocalWallets, deleteLocalWallet } from '@zap/utils/localWallets'
import { mainLog } from '@zap/utils/log'

/**
 * migration - Migration script to delete all tmp wallets from the filesystem.
 *
 * @returns {undefined}
 */
const migration = async () => {
  const { chains, networks } = config
  const isTmpWallet = wallet => wallet.wallet === 'wallet-tmp'
  const allLocalWallets = await getAllLocalWallets(chains, networks)
  const tmpWallets = allLocalWallets.filter(isTmpWallet)
  mainLog.debug('Found tmp wallets to delete: %O', tmpWallets)

  for (const wallet of tmpWallets) {
    await deleteLocalWallet(wallet) // eslint-disable-line no-await-in-loop
  }
}

export default migration

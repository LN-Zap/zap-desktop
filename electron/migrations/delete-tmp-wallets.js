import config from 'config'
import { mainLog } from '@zap/utils/log'
import { getAllLocalWallets, deleteLocalWallet } from '@zap/utils/localWallets'

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
    await deleteLocalWallet(wallet)
  }
}

export default migration

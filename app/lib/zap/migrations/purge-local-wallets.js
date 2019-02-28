import { purgeAllLocalWallets } from '../../utils/localWallets'

/**
 * Migration script to purge all local wallets, causing a resync of the blockchain data.
 */
const migration = async () => {
  await purgeAllLocalWallets()
}

export default migration

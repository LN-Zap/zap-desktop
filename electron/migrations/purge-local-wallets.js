import config from 'config'
import { purgeAllLocalWallets } from '@zap/utils/localWallets'

/**
 * Migration script to purge all local wallets, causing a resync of the blockchain data.
 */
const migration = async () => {
  const { chains, networks } = config
  await purgeAllLocalWallets(chains, networks)
}

export default migration

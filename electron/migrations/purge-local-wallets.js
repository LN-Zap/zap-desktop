import config from 'config'

import { purgeAllLocalWallets } from '@zap/utils/localWallets'

/**
 * migration - Migration script to purge all local wallets, causing a resync of the blockchain data.
 *
 * @returns {undefined}
 */
const migration = async () => {
  const { chains, networks } = config
  await purgeAllLocalWallets(chains, networks)
}

export default migration

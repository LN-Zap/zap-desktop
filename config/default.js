const { getPackageDetails, isStableVersion } = require('../app/lib/utils')

// The current stable base version.
// If the current version is in the same range asd this, the default database domain will be used.
const STABLE_VERSION = '0.4.x'

const { version } = getPackageDetails()

module.exports = {
  db: {
    namespace: 'ZapDesktop',
    domain: isStableVersion(version, STABLE_VERSION) ? null : 'next',
  },

  neutrino: {
    chain: 'bitcoin',
    network: 'testnet',
    connect: {
      testnet: ['testnet3-btcd.zaphq.io', 'testnet4-btcd.zaphq.io'],
      mainnet: ['mainnet1-btcd.zaphq.io', 'mainnet2-btcd.zaphq.io'],
    },
  },

  chains: ['bitcoin'],

  networks: ['testnet', 'mainnet'],

  bitcoin: {
    currency: 'sats',
  },

  litecoin: {
    currency: 'lits',
  },
}

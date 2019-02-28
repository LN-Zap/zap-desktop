const semver = require('semver')
const { getPackageDetails } = require('../app/lib/utils')

const { version } = getPackageDetails()

module.exports = {
  db: {
    namespace: 'ZapDesktop',
    domain: semver.lt(version, '0.4.0-alpha') ? null : 'next'
  },

  neutrino: {
    chain: 'bitcoin',
    network: 'testnet',
    connect: {
      testnet: ['testnet3-btcd.zaphq.io', 'testnet4-btcd.zaphq.io'],
      mainnet: ['mainnet1-btcd.zaphq.io', 'mainnet2-btcd.zaphq.io']
    }
  },

  chains: ['bitcoin'],

  networks: ['testnet', 'mainnet']
}

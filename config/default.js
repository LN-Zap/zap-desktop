const { getPackageDetails, isStableVersion } = require('@zap/utils')

// The current stable base version.
// If the current version is in the same range asd this, the default database domain will be used.
const STABLE_VERSION = '0.4.x'

module.exports = {
  // Default debug settings.
  debug: 'zap:main,zap:lnd,zap:updater',
  debugLevel: 'info',

  // Database settings.
  db: {
    namespace: 'ZapDesktop',
    domain: isStableVersion(getPackageDetails().version, STABLE_VERSION) ? null : 'next',
  },

  // Supported chains.
  chains: ['bitcoin', 'litecoin'],

  // Supported networks.
  networks: ['testnet', 'mainnet'],

  // Default chain for new wallets.
  chain: 'bitcoin',

  // Default network for new wallets.
  network: 'testnet',

  // Default settings for lnd.
  lnd: {
    // Default autopilot settings.
    autopilot: {
      active: true,
      private: true,
      maxchannels: 5,
      minchansize: 20000,
      maxchansize: 16777215,
      allocation: 0.6,
      minconfs: 0,
      assumechanvalid: true,
    },

    // Default ports.
    // We will search for free ports for lnd to use from these lists (from left to right).
    // To disable an interface, set the host to null.
    rpc: {
      host: 'localhost',
      port: [10009, 10008, 10007, 10006, 10005, 10004, 10003, 10002, 10001],
    },
    rest: {
      host: 'localhost',
      port: [8080, 8081, 8082, 8083, 8084, 8085, 8086, 8087, 8088, 8089],
    },
    p2p: {
      host: '0.0.0.0',
      port: [9735, 9734, 9733, 9732, 9731, 9736, 9737, 9738, 9739],
    },

    neutrino: {
      bitcoin: {
        testnet: ['testnet3-btcd.zaphq.io', 'testnet4-btcd.zaphq.io'],
        mainnet: ['mainnet1-btcd.zaphq.io', 'mainnet2-btcd.zaphq.io'],
      },
      litecoin: {
        testnet: [],
        mainnet: [],
      },
    },
  },

  // Default curreny units.
  units: {
    bitcoin: 'sats',
    litecoin: 'lits',
  },

  // Default invoice settings
  invoices: {
    expire: 86400,
  },
}
